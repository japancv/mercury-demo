import { Upload, message, UploadProps, Button } from 'antd';
import {
  LoadingOutlined,
  PlusOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { useState } from 'react';
import FirebaseImage from './FirebaseImage';
import { storage } from '../firebase';
import { ref, uploadBytes } from 'firebase/storage';

const getBase64 = (
  img: File | undefined,
  callback: (imageUrl: string | ArrayBuffer | null) => void
) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img as unknown as Blob);
};

type SimilarImages = {
  uid: string;
  similarityScore: number;
};

const images: SimilarImages[] = [
  {
    uid: 'rc-upload-1652377326817-3',
    similarityScore: 0.99,
  },
  {
    uid: 'rc-upload-1652377523439-3',
    similarityScore: 0.99,
  },
  {
    uid: 'rc-upload-1652377523439-7',
    similarityScore: 0.99,
  },
];

const Search = () => {
  const [loading, setLoading] = useState(false);
  const [imageUrlBase64, setImageUrlBase64] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [similarImages, setSimilarImages] = useState<SimilarImages[]>(images);
  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );
  const props: UploadProps = {
    name: 'search',
    showUploadList: false,
    listType: 'picture-card',
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
  return (
    <>
      <div className="flex justify-center">
        <div className="flex flex-col justify-self-center items-center w-48">
          <Upload {...props}>
            {imageUrlBase64 ? (
              <img
                src={imageUrlBase64}
                alt="avatar"
                style={{ width: '100%' }}
              />
            ) : (
              uploadButton
            )}
          </Upload>
          <Button
            className="w-48 my-3"
            type="primary"
            icon={<SearchOutlined />}
          >
            Search
          </Button>
        </div>
      </div>
      <div className="flex justify-center my-3">
        {similarImages.map((similarImage, index) => (
          <div key={index} className="mx-2 flex flex-col items-center">
            <FirebaseImage uid={similarImage.uid} />
            <div className="underline decoration-sky-500/30 text-xl my-2">
              Similarity:
            </div>
            <div className="text-base">{similarImage.similarityScore}</div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Search;
