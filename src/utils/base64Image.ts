export const getBase64 = (
  img: File | undefined,
  callback: (imageUrl: string | ArrayBuffer) => void
) => {
  const reader = new FileReader();
  reader.onloadend = () => callback(reader.result || '');
  reader.readAsDataURL(img as unknown as Blob);
};
