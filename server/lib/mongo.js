const CWD = process.cwd()
const config = require(CWD + '/config.json')
const MongoClient = require('mongodb').MongoClient
const mongoUrl = 'mongodb://' +
  config.mongodb.host +
  ':' + config.mongodb.port +
  '/' + config.mongodb.db

var db
// const doc = { a: 1 }
// const col = 'gsr'

let getDbStats = function (db, callback) {
  db.command({'dbStats': 1},
    function (err, results) {
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
    // insertOne(db, col, doc, function () {
    //   db.close()
    // })
  })
})

let insertOne = function (col, doc, callback) {
  let collection = db.collection(col)
  collection.insertOne(doc, function (err, r) {
    if (err) {
      l.error('insertOne', err)
    }
    l.info(r)
    callback(r)
  })
}

module.exports.insertOne = insertOne
