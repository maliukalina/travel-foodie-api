const { connectDb } = require("./db");


exports.deleteRestaurantsByCity = (req, res) => {
  const db = connectDb();
  db.collection("allRestaurants")
  .where("city", "==", "Berlin")
  .get()
  .then((collection) => {
      console.log ("here")
      collection.docs.map((doc) => {
        doc.delete()
        .then (
          console.log ("deleted")
        )
        .catch (console.log (error))
      });
      console.log (id)
      res.send(collection.docs.length);
    })
    .catch((err) => res.status(500).send(err));
};

//get city by name
exports.getCityByName = (req, res) => {
  const db = connectDb();
  console.log ("here")
  db.
  db.collection("cities").get()
    //.where("name", "==", req.params.city)
    .then((collection) => {
      console.log ("here")
      const city = collection.docs.map((doc) => {
        let item = doc.data();
        item.id = doc.id;
        //return item;
      });
      console.log (collection.docs.length)
      res.send(collection.docs.length);
    })
    .catch((err) => res.status(500).send(err));
};