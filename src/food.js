const { connectDb } = require ("./db")


//get All products
exports.getFood =(req,res) => {
  const db = connectDb()
  db.collection("food").get()
    .then(collection => {
      const food = collection.docs.map(doc => {
        let item = doc.data()
        item.id = doc.id
        return item
      })
      res.send(food)
    })
    .catch(err => res.status(500).send(err))
}