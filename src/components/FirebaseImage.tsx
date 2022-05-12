import { Image } from 'antd';
import { useState, useEffect } from 'react';
import { storage } from '../firebase';
import { ref, getDownloadURL } from 'firebase/storage';

const FirebaseImage = ({ uid }: { uid: string }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  useEffect(() => {
    const fetchImage = async () => {
      const today = new Date().toLocaleDateString().replace(/\//g, '-');
      const url = await getDownloadURL(ref(storage, `${today}/${uid}`));
      setImageUrl(url);
    };
    fetchImage();
  }, [uid]);
  return imageUrl ? (
    <Image width={200} src={imageUrl} preview={false} />
  ) : (
    <div>loading</div>
  );
};

export default FirebaseImage;
