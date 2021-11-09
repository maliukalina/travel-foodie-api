const express = require("express")
const cors = require("cors")
const {getCuisine} = require ("./src/cuisine.js")
const {getFood} = require ("./src/food.js")
const PORT = process.env.PORT || 5000
const app = express() 

app.use(cors())
app.get("/cuisine", getCuisine)
app.get("/food", getFood)


//exports.app = functions.https.onRequest(app)
app.listen(PORT, () => console.log(`Listening on port ${PORT}...`))