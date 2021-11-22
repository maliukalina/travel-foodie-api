const admin = require("firebase-admin");
const creds = require("../credentials.json");

exports.connectDb = () => {
  // check the connection
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(creds),
      storageBucket: 'travel-foodie-8fe89.appspot.com'
    });
  }
  // return firestore
  return admin.firestore();
};

exports.connectStorage = () => {
  // check the connection
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(creds),
      storageBucket: 'travel-foodie-8fe89.appspot.com'
    });
  }
  return admin.storage().bucket()
};