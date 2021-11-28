const { connectDb,connectStorage } = require("./db");

exports.findBestMatch = (req, res) => {
  const db = connectDb();
  const bucket = connectStorage();
  
  let queryResponse = {
    topCity: {},
   // matchingRestaurants: []
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
      if (cities.size===0) {
        let error= {
          error: "There is no restaurants found for your criteria. Please try again"
        }
        res.status(201).send(error); 
        return
      }
      let topCity = [...cities.entries()].reduce((a, e ) => e[1] > a[1] ? e : a)
      queryResponse.topCity = {
          name: topCity[0],
          score: topCity[1],
          url: "",
          description: "",
          restaurantCount: 0
        }
      
        const file = bucket.file(`city-images/${queryResponse.topCity.name.toLowerCase()}.jpeg`);
        queryResponse.topCity.url = file.publicUrl();
        matchingRestaurants.map ((item) => {
          if (item.city===queryResponse.topCity.name)
            {
              queryResponse.topCity.restaurantCount=queryResponse.topCity.restaurantCount+1
            //restImageFile = bucket.file(`restaurant-images/restImages/${item.id}.jpeg`);
            //item.url = restImageFile.publicUrl();
            //queryResponse.matchingRestaurants.push(item)
            }
        })

      db.collection("cities")
      .where("name", "==", queryResponse.topCity.name)
      .get()
      .then((collection) => {
        collection.docs.map((doc) => {
          queryResponse.topCity.description = doc.data().description    
          res.status(201).send(queryResponse); 
        })
      })
      
      })
};
