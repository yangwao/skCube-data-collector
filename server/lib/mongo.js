const CWD = process.cwd()
const config = require(CWD + '/config.json')
const MongoClient = require('mongodb').MongoClient
const mongoUrl = 'mongodb://' +
  config.mongodb.host +
  ':' + config.mongodb.port +
  '/' + config.mongodb.db

var db

let getDbStats = function (db, cb) {
  db.command({'dbStats': 1},
    function (err, results) {
      if (err) {
        l.error(err)
      }
      l.info(`gsr packets in db: ${results.objects}`)
      cb()
    }
  )
}

l.info('Mongodb @', config.mongodb.host)
MongoClient.connect(mongoUrl, function (err, database) {
  if (err) {
    l.error('Could not connect to Mongodb')
  }
  db = database
  l.info('Connected successfully to Mongodb')
  getDbStats(db, function () {
  })
})

let insertOne = function (col, doc, cb) {
  let collection = db.collection(col)
  collection.insertOne(doc, function (err, r) {
    if (err) {
      l.error('insertOne', err)
    }
    cb(r)
  })
}

let find = function (col, q, cb) {
  let cursor = db.collection(col)
  cursor.find(q)
    .toArray(function (err, docs) {
      if (err) {
        l.error('findBy', err)
      }
      cb(docs)
    })
}

let findDupes = function (col, q, cb) {
  let cursor = db.collection('gsr')
  cursor.findOneAndUpdate(
    q,
    { $inc: { seen: 1 } },
    { returnOriginal: false },
    function (err, r) {
      if (err) l.error('findDupes', err)

      cb(r)
    })
}

module.exports.insertOne = insertOne
module.exports.find = find
module.exports.findDupes = findDupes
