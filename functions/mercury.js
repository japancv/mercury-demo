const { createHmac } = require('crypto');
const axios = require('axios');

const mercuryAppId = process.env.MERCURY_APP_ID;
const mercuryAccessKey = process.env.MERCURY_ACCESS_KEY;
const mercurySecretKey = process.env.MERCURY_SECRET_KEY;
const mercuryBaseUrl = process.env.MERCURY_BASE_URL;

var generateAuthorizationHeaders = (uri, httpMethod) => {
  const date = new Date().toUTCString();
  const urlPath = new URL(uri).pathname;
  const signature = `x-date: ${date}\n${httpMethod.toUpperCase()} ${urlPath} HTTP/1.1`;
  const hmacSignature = createHmac('sha256', mercurySecretKey)
    .update(signature)
    .digest('base64');
  const authorization = `hmac username="${mercuryAccessKey}", algorithm="hmac-sha256", headers="x-date request-line", signature="${hmacSignature}"`;
  return {
    'x-date': date,
    Authorization: authorization,
  };
};

exports.listFeatureDatabase = () => {
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
