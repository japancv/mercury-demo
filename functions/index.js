const functions = require('firebase-functions');
const { listFeatureDatabase } = require('./mercury');

exports.cleanupDataDaily = functions
  .region('asia-northeast1')
  .pubsub.schedule('59 23 * * *') // runs every night at 23:59
  .timeZone('Asia/Tokyo')
  .onRun(() => {
    console.log('Deletion started...');
    listFeatureDatabase();
    console.log('Deletion ended...');
  });
