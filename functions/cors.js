const functions = require('firebase-functions');
var express = require('express'),
  request = require('request'),
  bodyParser = require('body-parser'),
  app = express();
var { generateAuthorizationHeaders } = require('./mercury');

app.use(bodyParser.json({ limit: '50mb' }));

app.all('*', function (req, res) {
  // Set CORS headers: allow all origins, methods, and headers: you may want to lock this down in a production environment
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, PATCH, POST, DELETE');
  res.header(
    'Access-Control-Allow-Headers',
    req.header('access-control-request-headers')
  );

  if (req.method === 'OPTIONS') {
    res.status(204).send('');
  } else {
    var targetURL = 'https://mercury-ap-northeast-1.japancv.co.jp';
    const method = req.method;
    const url = targetURL + req.url;
    const authorizationHeaders = generateAuthorizationHeaders(url, method);
    const options = {
      method: req.method,
      url: targetURL + req.url,
      headers: authorizationHeaders,
      body: JSON.stringify(req.body),
    };
    console.log(options);
    request(options, function (error, response, body) {
      console.log(body);
      if (error) {
        console.error('error: ' + response.statusCode);
      }
    }).pipe(res);
  }
});

exports.cors = functions.region('asia-northeast1').https.onRequest(app);
