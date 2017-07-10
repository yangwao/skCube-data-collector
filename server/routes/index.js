const CWD = process.cwd()
const config = require(CWD + '/config.json')

const uuid = require('uuid')
const crypto = require('crypto')
const fs = require('fs')
const express = require('express')
const router = express.Router()
const multer = require('multer')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, CWD + config.gsr.file.storageFolder)
  },
  filename: function (req, file, cb) {
    cb(null, uuid.v4() + '_' + file.originalname)
  }
})

function checksum (str, algorithm, encoding) {
    return crypto
        .createHash(algorithm)
        .update(str, 'utf8')
        .digest(encoding || 'hex')
}

const upload = multer({storage: storage})

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' })
})

router.post('/raw', upload.single('gsr'), function (req, res, next) {

  const b = req.body
  if (!req.file) {
    return res.status(400).json({error: 'missing gsr'})
  }
  if (req.file.size > config.gsr.file.maxSize) {
    return res.status(400).json({error: 'gsr file too big'})
  }
  if (!b.timestamp) {
    return res.status(400).json({error: 'missing timestamp'})
  }
  if (!b.sourceCallsign) {
    return res.status(400).json({error: 'missing sourceCallsign'})
  }
  if (!b.destinationCallsign) {
    return res.status(400).json({error: 'missing destinationCallsign'})
  }
  if (!b.tag) {
    return res.status(400).json({error: 'missing tag'})
  }

  fs.readFile(CWD + config.gsr.file.storageFolder + '/' + req.file.filename, function(err, data) {
    l.info(checksum(data, 'sha512'))
  })

  res.status(200).json({status: 'ok'})
})

module.exports = router
