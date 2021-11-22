const { connectDb } = require("./db");

//get city by name
exports.getCityByName = (req, res) => {
  const db = connectDb();
  db.collection("cities")
    .where("name", "==", req.params.city)
    .get()
    .then((collection) => {
      const city = collection.docs.map((doc) => {
        let item = doc.data();
        item.id = doc.id;
        return item;
      });
      res.send(city[0]);
    })
    .catch((err) => res.status(500).send(err));
};