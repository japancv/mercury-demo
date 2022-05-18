'use strict';

const functions = require('firebase-functions');
const cors = require('cors');

const request = require('request');

exports.cors = functions
  .region('asia-northeast1')
  .https.onRequest((req, res) => {
    cors()(req, res, () => {
      if (req.method === 'OPTIONS') {
        // CORS Preflight
        res.send();
      } else {
        console.log('Query:', req.query);
        console.log('Body:', req.body);

        var targetURL = process.env.MERCURY_BASE_URL;
        var url = targetURL + req.url;
        console.log('Request:', url);

        const headers = {
          authorization: req.header('authorization'),
          'x-date': req.header('x-date'),
          'content-type': req.get('content-type')
            ? req.get('content-type')
            : 'application/json',
        };

        const options = {
          method: req.method,
          url,
          headers,
          ody: JSON.stringify(req.body),
        };

        request(options, function (error, response, body) {
          console.log(body);
          if (error) {
            console.error('error: ' + response.statusCode);
          }
        }).pipe(res);
      }
    });
  });
