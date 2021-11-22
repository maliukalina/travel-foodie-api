const functions = require("firebase-functions");

const express = require("express");
const cors = require("cors");
const { getCuisine } = require("./src/cuisine.js");
const { getFood } = require("./src/food.js");
const { getCityByName } = require("./src/cities.js");
const { findBestMatch } = require("./src/search.js");
const { findRestaurants } = require("./src/searchRestaurant.js");
//const { admin } = require("googleapis/build/src/apis/admin");
const app = express();

const withAutorization = async (req, res, next) =>{
  const jwt = req.headers.authorization
  try {
    const id = await admin.auth().verifyIdToken(jwt)
    res.locals.userId = id.uid
  }catch {
    res.status(403).send('Unauthorized')
    return
  }
  next()
}

app.use(cors());
//app.use(express.json)
app.get("/cuisine", getCuisine);
app.get("/food", getFood);
app.get("/cities/:city", getCityByName);
app.post("/search", findBestMatch);
app.post("/search/:city", findRestaurants);
/*app.get('/authenticated',withAutorization, (req, res) => {
  return res.send({your:'cool'}).status(200)
})*/


exports.app = functions.https.onRequest(app)
