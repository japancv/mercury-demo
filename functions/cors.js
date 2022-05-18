const functions = require('firebase-functions');
var express = require('express'),
  request = require('request'),
  bodyParser = require('body-parser'),
  app = express();

var myLimit = typeof process.argv[2] != 'undefined' ? process.argv[2] : '50mb';
console.log('Using limit: ', myLimit);

app.use(bodyParser.json({ limit: myLimit }));

app.all('*', function (req, res) {
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
    var targetURL = 'https://mercury-ap-northeast-1.japancv.co.jp';
    if (!targetURL) {
      res.send(500, {
        error: 'There is no Target-Endpoint header in the request',
      });
      return;
    }
    const headers = {
      authorization: req.header('authorization'),
      'x-date': req.header('x-date'),
      // 'content-type': req.header('content-type')
    };
    const options = {
      method: req.method,
      url: targetURL + req.url,
      headers,
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
