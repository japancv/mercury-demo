'use strict';

const functions = require('firebase-functions');

const fetch = require('node-fetch');

exports.cors = functions
  .region('asia-northeast1')
  .https.onRequest((req, res) => {
    // Set CORS headers: allow all origins, methods, and headers: you may want to lock this down in a production environment
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, PATCH, POST, DELETE');
    res.header(
      'Access-Control-Allow-Headers',
      req.header('access-control-request-headers')
    );

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
        headers,
        body:
          req.get('content-type') === 'application/json'
            ? JSON.stringify(req.body)
            : req.body,
      };

      fetch(url, options)
        .then((r) =>
          r.headers.get('content-type') === 'application/json'
            ? r.json()
            : r.text()
        )
        .then((body) => res.status(200).send(body));
    }
  });
