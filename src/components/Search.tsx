import { Upload, message, UploadProps, Button } from 'antd';
import {
  LoadingOutlined,
  PlusOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { useState } from 'react';
import FirebaseImage from './FirebaseImage';
import { storage } from '../services/firebase';
import { getBase64 } from '../utils/base64Image';
import { searchFace } from '../services/mercury';
import { ref, uploadBytes } from 'firebase/storage';

type SimilarImages = {
  feature: {
    uid: string;
    extra_info: string;
  };
  score: number;
};

const dbId = '0c377fc1-e9e0-45c2-8e80-91252b48d000';

const Search = () => {
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [imageUrlBase64, setImageUrlBase64] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [similarImages, setSimilarImages] = useState<SimilarImages[]>([]);
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
        getBase64(info.file.originFileObj, (base64Image) => {
          setImageUrlBase64(base64Image as string);
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

  const onClick = async () => {
    try {
      setSearching(true);
      const base64 = imageUrlBase64?.split(',');
      const response = (await searchFace({
        dbId,
        base64Image: base64?.[1] || '',
      })) as any;
      const batch = response.data.batches[0];
      const matches = batch.features;
      setSimilarImages(matches);
    } catch (error) {
      message.error('some error');
    } finally {
      setSearching(false);
    }
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
            onClick={onClick}
            icon={<SearchOutlined />}
          >
            {searching ? 'Searching...' : 'Search'}
          </Button>
        </div>
      </div>
      <div className="flex justify-center my-3">
        {similarImages.map((similarImage, index) => (
          <div key={index} className="mx-2 flex flex-col items-center">
            <FirebaseImage storageRef={similarImage.feature.extra_info} />
            <div className="underline decoration-sky-500/30 text-xl my-2">
              Similarity:
            </div>
            <div className="text-base">{similarImage.score}</div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Search;
