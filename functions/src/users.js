const { connectDb,connectStorage } = require ("./db")

exports.createUser =(req,res) => {
  const db = connectDb()
  const uid = req.body.uid
  let userObj = {
    name: req.body.name,
    email: req.body.email,
  };
  db.collection("users").doc(uid).get ()
  .then (docRef => {
    if (docRef.exists) {
      if (docRef.data().destinations) userObj.destinations = docRef.data().destinations
      if (docRef.data().bookmarks) userObj.bookmarks = docRef.data().bookmarks
      }
    console.log (userObj)
      db.collection("users").doc(uid).set(userObj)
      .then( () => {
        userObj.uid = uid
        res.status(201).send(userObj)
        })
      .catch(err => res.status(500).send(err))
  })
}

exports.getUser =(req,res) => {
  const db = connectDb()
  const uid = res.locals.uid
  console.log (uid)
  db.collection("users").doc(uid).get()
  .then(doc => {
    let item = doc.data()
    item.uid = doc.id
    res.status(201).send(item)
  })
  .catch(err => res.status(500).send(err))
}

exports.login =(req,res) => {
  const db = connectDb()
  const uid = res.locals.uid
  console.log (uid)
  db.collection("users").doc(uid).get()
  .then(doc => {
    let item = doc.data()
    item.uid = doc.id
    res.status(201).send(item)
  })
  .catch(err => res.status(500).send(err))
}

exports.bookmarkRestaurant =(req,res) => {
  const db = connectDb()
  const uid = res.locals.uid
  const bookmarkObject = {
    restaurantId : req.body.restaurantId,
    city : req.body.city
  }
  db.collection("users").doc(uid).get()
  .then(doc => {
    let item = doc.data()
    item.uid = doc.id
    let findMatch = -1
    if (item.bookmarks){
       findMatch = item.bookmarks.findIndex ( elem => {
          return elem.restaurantId === bookmarkObject.restaurantId
      })
      } else {
        item.bookmarks = []
      }
    if (findMatch>-1)
      {
        item.bookmarks.splice(findMatch, 1); //unbookmark
      } else {
        item.bookmarks.push (bookmarkObject)        
      }
    db.collection('users').doc(uid).update (item)
    .then (res.status(201).send(item))
  })
  .catch(err => res.status(500).send(err))
}

exports.getBookmarks =(req,res) => {
  db.collection('users').doc(uid).update (item)
    .then (res.status(201).send(item))
}
exports.addUserDestination =(req,res) => {
  const db = connectDb();
  const bucket = connectStorage();

  const uid = res.locals.uid

  let destinationObject = {
    cuisine: req.body.cuisine,
    food: req.body.food,
    budget: req.body.budget,
    city: req.body.city,
    url: ""
  };
  const file = bucket.file(`city-images/${req.body.city.toLowerCase()}.jpeg`);
  destinationObject.url = file.publicUrl();

  db.collection("users").doc(uid).get()
  .then (doc => {
    let item = doc.data()
    item.uid = doc.id
    let findMatch = -1
    if (item.destinations){
      findMatch = item.destinations.findIndex ( elem => {
        return elem.city === destinationObject.city
      })
      } else {
        item.destinations = []
      } 
    if (findMatch>-1)
      {
        item.destinations[findMatch] = destinationObject
      } else {
        item.destinations.push (destinationObject)        
      }
    db.collection('users').doc(uid).update (item)
    .then (res.status(201).send(item))
  })
  .catch(err => res.status(500).send(err))

}