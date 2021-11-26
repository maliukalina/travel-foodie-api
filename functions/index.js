const functions = require("firebase-functions");
const admin = require('firebase-admin')
const creds = require("./credentials.json");

const express = require("express");
const cors = require("cors");
const { getCuisine } = require("./src/cuisine.js");
const { getFood } = require("./src/food.js");
const { createUser, getUser, bookmarkRestaurant, addUserDestination, getBookmarks,login } = require("./src/users.js");
const { getCityByName } = require("./src/cities.js");
const { findBestMatch } = require("./src/search.js");
const { findRestaurants } = require("./src/searchRestaurant.js");

const app = express();
admin.initializeApp({
  credential: admin.credential.cert(creds),
  storageBucket: 'travel-foodie-8fe89.appspot.com'
});

const withAutorization = async (req, res, next) =>{
  const jwt = req.headers.authorization

  try {
    const id = await admin.auth().verifyIdToken(jwt)
    console.log (id)
    res.locals.uid = id.uid
  }catch {
    res.status(403).send('Unauthorized')
    return
  }
  next()
}

app.use(cors());

app.get("/cuisine", getCuisine);
app.get("/food", getFood);
app.get("/cities/:city", getCityByName);
app.post("/search", findBestMatch);
app.post("/search/:city", findRestaurants);
app.post("/createUser", createUser);
app.post("/login", login);
app.get("/getUser", withAutorization, getUser);
app.post("/addDestination", withAutorization, addUserDestination)
app.post("/addBookmark", withAutorization, bookmarkRestaurant);

exports.app = functions.https.onRequest(app)
