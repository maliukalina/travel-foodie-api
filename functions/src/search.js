const { connectDb,connectStorage } = require("./db");

exports.findBestMatch = (req, res) => {
  const db = connectDb();
  const bucket = connectStorage();
  
  let queryResponse = {
    matchingCities: [],
    matchingRestaurants: []
  };
  let foodPreferences = {
    cuisine: req.body.cuisine,
    food: req.body.food,
    budget: req.body.budget,
  };

  let cities = new Map();

  db.collection("allRestaurants")
    //.where("priceLevel", "==", foodPreferences.budget)
    .where("cuisine", "array-contains-any", foodPreferences.cuisine)
    .get()
    .then((restaurantMatchCollection) => {
      let matchingRestaurants = [];
      restaurantMatchCollection.docs.map((restaurantDoc) => {
        let restaurant = restaurantDoc.data();
        restaurant.id = restaurantDoc.id;
        let relScore = 0;
      
        let foodRestrictionMatch = foodPreferences.food.every(elem => restaurant.cuisine.includes(elem))
        if (foodRestrictionMatch) {
          let intersection = restaurant.cuisine.filter(
            (element) => foodPreferences.cuisine.indexOf(element) !== -1
          );
          relScore += intersection.length;

          restaurant.relScore = relScore;
          matchingRestaurants.push(restaurant);
        
          if (cities.has (restaurant.city)) {
            currentcityScore = cities.get(restaurant.city)
            cities.set(restaurant.city,relScore+currentcityScore)
          } else {
            cities.set (restaurant.city,relScore)
          }
        }
      });
      console.log([...cities.entries()].reduce((a, e ) => e[1] > a[1] ? e : a))
      cities.forEach ((value, key) => {
        let cityObj = {
          name: key,
          score: value,
          url: ""
        }
      
        const file = bucket.file(`city-images/${key.toLowerCase()}.jpeg`);
        cityObj.url = file.publicUrl();
        
        queryResponse.matchingCities.push(cityObj)
        queryResponse.matchingRestaurants = matchingRestaurants
      })
      
      res.status(201).send(queryResponse);
    })
};
