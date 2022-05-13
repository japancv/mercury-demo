import CryptoJS from 'crypto-js';
import axios from 'axios';

const mercuryAppId = process.env.REACT_APP_MERCURY_APP_ID;
const mercuryAccessKey = process.env.REACT_APP_MERCURY_ACCESS_KEY;
const mercurySecretKey = process.env.REACT_APP_MERCURY_SECRET_KEY;
const mercuryBaseUrl = process.env.REACT_APP_MERCURY_BASE_URL;

export const generateAuthorizationHeaders = (
  url: string,
  httpMethod: string
) => {
  const dateTimeString = new Date().toUTCString();
  const path = new URL(url).pathname;
  const signature = `x-date: ${dateTimeString}\n${httpMethod.toUpperCase()} ${path} HTTP/1.1`;
  const hmacSignature = CryptoJS.enc.Base64.stringify(
    CryptoJS.HmacSHA256(signature, mercurySecretKey || '')
  );
  const authorization = `hmac username="${mercuryAccessKey}", algorithm="hmac-sha256", headers="x-date request-line", signature="${hmacSignature}"`;
  return {
    'x-date': dateTimeString,
    Authorization: authorization,
  };
};

export const listFeatureDatabase = () => {
  const url = `${mercuryBaseUrl}/openapi/face/v1/${mercuryAppId}/databases`;
  const method = 'get';
  const authorizationHeaders = generateAuthorizationHeaders(url, method);
  const options = {
    method,
    headers: {
      ...authorizationHeaders,
    },
    url,
  };
  return axios(options);
};

export const addFace = ({
  dbId,
  base64Image,
  firebaseObjectId,
}: {
  dbId: string;
  base64Image: string | ArrayBuffer;
  firebaseObjectId: string;
}) => {
  const url = `${mercuryBaseUrl}/openapi/face/v1/${mercuryAppId}/databases/${dbId}/features`;
  const method = 'post';
  const authorizationHeaders = generateAuthorizationHeaders(url, method);
  const options = {
    method,
    headers: { 'content-type': 'application/json', ...authorizationHeaders },
    data: {
      images: [
        {
          image: {
            data: base64Image,
          },
          extra_info: firebaseObjectId,
        },
      ],
    },
    url,
  };
  return axios(options);
};

export const searchFace = ({
  dbId,
  base64Image,
}: {
  dbId: string;
  base64Image: string | ArrayBuffer;
}) => {
  const url = `${mercuryBaseUrl}/openapi/face/v1/${mercuryAppId}/databases/search`;
  const method = 'post';
  const authorizationHeaders = generateAuthorizationHeaders(url, method);
  const options = {
    method,
    headers: { 'content-type': 'application/json', ...authorizationHeaders },
    data: {
      image: {
        data: base64Image,
      },
      db_ids: [dbId],
      top_k: 3,
      min_score: 0.8,
    },
    url,
  };
  return axios(options);
};
