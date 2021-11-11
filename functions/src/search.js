const { connectDb } = require ("./db")


//get All products
exports.findBestMatch =(req,res) => {
  const db = connectDb()
  let foodPreferences = {
    cuisine: req.body.cuisine,
    food: req.body.food,
    priceRange: req.body.priceRange
  }
  db.collection("cities").get()
  .then(citiesCollection => {
    let cities = []
    citiesCollection.docs.map(cityDoc => {
      let city = cityDoc.data()
      city.id = cityDoc.id
      cities.push (city)
    }) 
    return cities 
  }).then(cities => {
    cities.map (city => {
      let cityCollection = db.collection(city.collectionName)
      cityCollection.where('cuisine', 'array-contains-any', foodPreferences.cuisine).get()
      .then(cuisineCollection => {
        cuisineCollection.docs.map(restaurantDoc => {
          let restaurant = restaurantDoc.data()
          restaurant.id = restaurantDoc.id
          console.log(restaurant)
        })
      })  
    })
   })

  let matchingRestaurants = []
  //const restaurant =
  console.log (foodPreferences)
  //db.collection("orders").add(newOrder)
  //  .then(docRef => res.status(201).send({id:docRef.id}))
  //  .catch(err => res.status(500).send(err))
  res.status(201).send(foodPreferences)
}