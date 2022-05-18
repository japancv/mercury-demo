const functions = require('firebase-functions');
const {
  listFeatureDatabase,
  removeFeatureDatabase,
  createFeatureDatabase,
  getToday,
} = require('./mercury');

exports.cleanupDataDaily = functions
  .region('asia-northeast1')
  .pubsub.schedule('59 23 * * *') // runs every night at 23:59
  .timeZone('Asia/Tokyo')
  .onRun(async () => {
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
  });
