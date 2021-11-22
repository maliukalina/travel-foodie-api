const { connectDb } = require("./db");

//get All products
exports.getCuisine = (req, res) => {
  const db = connectDb();
  db.collection("cuisine")
    .get()
    .then((collection) => {
      const cuisine = collection.docs.map((doc) => {
        let item = doc.data();
        item.id = doc.id;
        return item;
      });
      res.send(cuisine);
    })
    .catch((err) => res.status(500).send(err));
};
