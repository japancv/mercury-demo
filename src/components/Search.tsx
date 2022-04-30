import { Upload, message, UploadProps, Button, Image } from 'antd';
import {
  LoadingOutlined,
  PlusOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { useState } from 'react';

const getBase64 = (
  img: File | undefined,
  callback: (imageUrl: string | ArrayBuffer | null) => void
) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img as unknown as Blob);
};

type SimilarImages = {
  url: string;
  similarityScore: number;
};

const images: SimilarImages[] = [
  {
    url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    similarityScore: 0.99,
  },
  {
    url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    similarityScore: 0.99,
  },
  {
    url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    similarityScore: 0.99,
  },
];

const Search = () => {
  const [loading, setLoading] = useState(false);
  const [imageUrlBase64, setImageUrlBase64] = useState<string | null>(null);
  const [similarImages, setSimilarImages] = useState<SimilarImages[]>(images);
  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );
  const props: UploadProps = {
    name: 'search',
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
            <Image width={200} src={similarImage.url} preview={false} />
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
