import { Upload, message, UploadProps } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { storage } from '../services/firebase';
import { addFace, listFeatureDatabase } from '../services/mercury';
import { getBase64 } from '../utils/base64Image';
import { ref, uploadBytes } from 'firebase/storage';

const { Dragger } = Upload;

const UploadImage = () => {
  const props: UploadProps = {
    name: 'file',
    listType: 'picture-card',
    multiple: true,
    beforeUpload: (file) => {
      const isImage = file.type.includes('image/');
      if (!isImage) {
        message.error(`${file.name} is not an image file`);
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('Image must smaller than 2MB!');
      }
      return isImage && isLt2M;
    },
    onChange(info) {
      const { status } = info.file;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    async customRequest({ onError, onSuccess, file }) {
      // @ts-ignore
      const uid = file.uid;
      const today = new Date().toLocaleDateString().replace(/\//g, '-');
      const filePath = `${today}/${uid}`;
      const storageRef = ref(storage, filePath);
      try {
        await uploadBytes(storageRef, file as File);
        getBase64(file as File, async (base64Image) => {
          try {
            const base64 = (base64Image as string).split(',');
            const res = (await listFeatureDatabase()) as any;
            const dbId = res.data.databases[0];
            await addFace({
              dbId,
              base64Image: base64[1],
              firebaseObjectId: filePath,
            });
            // @ts-ignore
            onSuccess('success');
          } catch (error) {
            // @ts-ignore
            onError(error);
          }
        });
      } catch (e) {
        // @ts-ignore
        onError(e);
      }
    },
  };

  return (
    <Dragger {...props}>
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">
        Click or drag file to this area to upload
      </p>
      <p className="ant-upload-hint">
        Support for a single or bulk upload. Strictly prohibit from uploading
        company data or other band files
      </p>
    </Dragger>
  );
};

export default UploadImage;
