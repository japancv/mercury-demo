const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp({
  storageBucket: 'gcp-tech-dev.appspot.com',
});

const storage = admin.storage();

const today = new Date().toLocaleDateString().replace(/\//g, '-');

exports.cleanupDataDaily = functions
  .region('asia-northeast1')
  .pubsub.schedule('59 8 * * *') // runs every night at 23:59
  .timeZone('Asia/Tokyo')
  .onRun(() => {
    const bucket = storage.bucket();
    bucket.deleteFiles({
      prefix: `${today}/`,
    });
  });
