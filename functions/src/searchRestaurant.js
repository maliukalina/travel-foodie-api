const { connectDb } = require("./db");

exports.findRestaurants = (req, res) => {
  const db = connectDb();
  console.log (req.params.city)
  let  matchingRestaurants = []
  
  let foodPreferences = {
    cuisine: req.body.cuisine,
    food: req.body.food,
    budget: req.body.budget,
  };

  let cities = new Map();

  let combinedArray = foodPreferences.food.concat(foodPreferences.cuisine);
  db.collection("allRestaurants")
    .where("priceLevel", "==", foodPreferences.budget)
    .where("city","==", req.params.city)
    .where("cuisine", "array-contains-any", combinedArray)
    .get()
    .then((restaurantMatchCollection) => {
      console.log("here")
      restaurantMatchCollection.docs.map((restaurantDoc) => {
        console.log("here1")
        let restaurant = restaurantDoc.data();
        restaurant.id = restaurantDoc.id;
        let relScore = 0;
        let intersection = restaurant.cuisine.filter(
          (element) => combinedArray.indexOf(element) !== -1
        );
        relScore += intersection.length;

        restaurant.relScore = relScore;
        matchingRestaurants.push(restaurant);
      });
      
      res.status(201).send(matchingRestaurants);
    })
};
