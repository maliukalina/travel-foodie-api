const { connectDb, connectStorage } = require("./db");

exports.findRestaurants = (req, res) => {
  const db = connectDb();
  const bucket = connectStorage();
  let  matchingRestaurants = []
  
  let foodPreferences = {
    cuisine: req.body.cuisine,
    food: req.body.food,
    budget: req.body.budget,
  };

  let cities = new Map();

  db.collection("allRestaurants")
    //.where("priceLevel", "==", foodPreferences.budget)
    .where("city","==", req.params.city)
    .where("cuisine", "array-contains-any", foodPreferences.cuisine)
    .get()
    .then((restaurantMatchCollection) => {
      restaurantMatchCollection.docs.map((restaurantDoc) => {
     
        let restaurant = restaurantDoc.data();
        restaurant.id = restaurantDoc.id;
        let foodRestrictionMatch = foodPreferences.food.every(elem => restaurant.cuisine.includes(elem))
        if (foodRestrictionMatch) {
          const file = bucket.file(`restaurant-images/restImages/${restaurant.id}.jpeg`);
          restaurant.url = file.publicUrl();
        
          let relScore = 0;
          let intersection = restaurant.cuisine.filter(
            (element) => foodPreferences.cuisine.indexOf(element) !== -1
          );
          relScore += intersection.length;

          restaurant.relScore = relScore;
          matchingRestaurants.push(restaurant);
          }
      });
      
      res.status(201).send(matchingRestaurants);
    })
};
