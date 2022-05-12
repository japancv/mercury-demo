// import { Upload, message, UploadProps, Form } from 'antd';
// import { InboxOutlined } from '@ant-design/icons';
// import { storage } from '../firebase';
// import { useState } from 'react';
// import { UploadFile } from 'antd/lib/upload/interface';

// const { Dragger } = Upload;

// const UploadImage = () => {
//   const [fileList, setFileList] = useState<UploadFile[]>([]);
//   const props: UploadProps = {
//     name: 'file',
//     multiple: true,
//     listType: 'picture-card',
//     onChange: ({ fileList }) =>
//       setFileList(fileList.filter((file) => file.status !== 'error')),
//     onRemove: async (file) => {
//       const index = fileList.indexOf(file);
//       const newFileList = fileList.slice();
//       newFileList.splice(index, 1);

//       setFileList(newFileList);
//     },
//     beforeUpload: (file) => {
//       const isImage = file.type.includes('image/');
//       if (!isImage) {
//         message.error(`${file.name} is not an image file`);
//       }
//       const isLt2M = file.size / 1024 / 1024 < 2;
//       if (!isLt2M) {
//         message.error('Image must smaller than 2MB!');
//       }
//       return isImage && isLt2M;
//     },
//   };

//   const onFinish = async () => {
//     try {
//       setSubmitting(true);

//       await Promise.all(
//         fileList.map(async (file) => {
//           const fileName = `uploads/images/${Date.now()}-${file.name}`;
//           const fileRef = storageRef.child(fileName);
//           try {
//             const designFile = await fileRef.put(file.originFileObj);
//             const downloadUrl = await designFile.ref.getDownloadURL();
//             const item = {
//               url: downloadUrl,
//               path: fileName,
//               uploadedAt: firebase.firestore.Timestamp.now(),
//             };
//             await db.collection('images').add(item);
//           } catch (e) {
//             console.log(e);
//           }
//         })
//       );

//       setFileList([]);
//       message.success(`Images added successfully.`, 2);
//     } catch (err) {
//       console.log(err);
//       message.error(`Error adding images.`, 2);
//     } finally {
//       setSubmitting(false);
//     }
//   };
//   return (
//     <Form onFinish={onFinish}>
//       <Dragger fileList={fileList} {...props}>
//         <p className="ant-upload-drag-icon">
//           <InboxOutlined />
//         </p>
//         <p className="ant-upload-text">
//           Click or drag file to this area to upload
//         </p>
//         <p className="ant-upload-hint">
//           Support for a single or bulk upload. Strictly prohibit from uploading
//           company data or other band files
//         </p>
//       </Dragger>
//     </Form>
//   );
// };

// export default UploadImage;

export {};
