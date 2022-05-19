const functions = require('firebase-functions');
const {
  listFeatureDatabase,
  removeFeatureDatabase,
  createFeatureDatabase,
  getToday,
} = require('./mercury');
const { cors } = require('./cors');

const deleteAndCreateNew = async () => {
  try {
    console.log('Deletion started...');
    const res = await listFeatureDatabase();
    const dbId = res.data.databases[0];
    await removeFeatureDatabase(dbId);
    await createFeatureDatabase(getToday);
    console.log('Deletion ended...');
  } catch (error) {
    console.log(error);
  }
};

exports.cleanupDataDaily = functions
  .region('asia-northeast1')
  .pubsub.schedule('59 23 * * *') // runs every night at 23:59
  .timeZone('Asia/Tokyo')
  .onRun(() => {
    console.log('This will be run every day at 11:59 PM!');
    deleteAndCreateNew();
    return null;
  });

exports.manualCleanup = functions
  .region('asia-northeast1')
  .https.onRequest((req, res) => {
    deleteAndCreateNew()
      .then(() => {
        res.send('success');
      })
      .catch(() => {
        res.send('error');
      });
  });

exports.cors = cors;
