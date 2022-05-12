import { Upload, message, UploadProps } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { storage } from '../firebase';
import { ref, uploadBytes } from 'firebase/storage';

const { Dragger } = Upload;

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
    const storageRef = ref(storage, `${today}/${uid}`);
    try {
      await uploadBytes(storageRef, file as File);
      // @ts-ignore
      onSuccess('success');
    } catch (e) {
      // @ts-ignore
      onError(e);
    }
  },
};

const UploadImage = () => (
  <Dragger {...props}>
    <p className="ant-upload-drag-icon">
      <InboxOutlined />
    </p>
    <p className="ant-upload-text">Click or drag file to this area to upload</p>
    <p className="ant-upload-hint">
      Support for a single or bulk upload. Strictly prohibit from uploading
      company data or other band files
    </p>
  </Dragger>
);

export default UploadImage;
