const functions = require("firebase-functions");

const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const {getCuisine} = require ("./src/cuisine.js")
const {getFood} = require ("./src/food.js")
const {findBestMatch} = require ("./src/search.js")
const PORT = process.env.PORT || 5000
const app = express() 

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.get("/cuisine", getCuisine)
app.get("/food", getFood)
app.post("/search", findBestMatch)


//exports.app = functions.https.onRequest(app)
app.listen(PORT, () => console.log(`Listening on port ${PORT}...`))
