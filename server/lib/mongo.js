const CWD = process.cwd()
const config = require(CWD + '/config.json')
const MongoClient = require('mongodb').MongoClient
const mongoUrl = 'mongodb://' +
  config.mongodb.host +
  ':' + config.mongodb.port +
  '/' + config.mongodb.db

var db

let getDbStats = function (db, callback) {
  db.command({'dbStats': 1},
    function (err, results) {
      if (err) {
        l.error(err)
      }
      l.info(results)
      callback()
    }
  )
}

l.info('Mongodb @', config.mongodb.host)
MongoClient.connect(mongoUrl, function (err, database) {
  if (err) {
    l.error('Could not connect to mongodb')
  }
  db = database
  l.info('Connected successfully to mongodb')
  getDbStats(db, function () {
  })
})

let insertOne = function (col, doc, callback) {
  let collection = db.collection(col)
  collection.insertOne(doc, function (err, r) {
    if (err) {
      l.error('insertOne', err)
    }

    callback(r)
  })
}

module.exports.insertOne = insertOne
