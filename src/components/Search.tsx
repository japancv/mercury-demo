import { Upload, message, UploadProps } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { useState } from 'react';

const getBase64 = (
  img: File | undefined,
  callback: (imageUrl: string | ArrayBuffer | null) => void
) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img as unknown as Blob);
};

const Search = () => {
  const [loading, setLoading] = useState(false);
  const [imageUrlBase64, setImageUrlBase64] = useState<string | null>(null);
  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );
  const props: UploadProps = {
    name: 'search',
    className: 'avatar-uploader',
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
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
    onChange: (info) => {
      if (info.file.status === 'uploading') {
        setLoading(true);
        return;
      }
      if (info.file.status === 'done') {
        // Get this url from response in real world.
        getBase64(info.file.originFileObj, (imageUrl) => {
          setImageUrlBase64(imageUrl as string);
          setLoading(false);
        });
      }
    },
    showUploadList: false,
    listType: 'picture-card',
  };
  return (
    <Upload {...props}>
      {imageUrlBase64 ? (
        <img src={imageUrlBase64} alt="avatar" style={{ width: '100%' }} />
      ) : (
        uploadButton
      )}
    </Upload>
  );
};

export default Search;
