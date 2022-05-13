import { Image } from 'antd';
import { useState, useEffect } from 'react';
import { storage } from '../services/firebase';
import { ref, getDownloadURL } from 'firebase/storage';

const FirebaseImage = ({ storageRef }: { storageRef: string }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  useEffect(() => {
    const fetchImage = async () => {
      const url = await getDownloadURL(ref(storage, storageRef));
      setImageUrl(url);
    };
    fetchImage();
  }, [storageRef]);
  return imageUrl ? (
    <Image width={200} src={imageUrl} preview={false} />
  ) : (
    <div>loading</div>
  );
};

export default FirebaseImage;
