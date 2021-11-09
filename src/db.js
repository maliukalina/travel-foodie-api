const admin = require("firebase-admin");
const creds = require("../credentials.json");

exports.connectDb = () => {
  // check the connection
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(creds),
    });
  }
  // return firestore
  return admin.firestore();
};