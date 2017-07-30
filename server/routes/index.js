const CWD = process.cwd()
const config = require(CWD + '/config.json')

const uuid = require('uuid')
const crypto = require('crypto')
const fs = require('fs')
const db = require('../lib/mongo')
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

const upload = multer({storage: storage})

function checksum (str, algorithm, encoding) {
  return crypto
    .createHash(algorithm)
    .update(str, 'utf8')
    .digest(encoding || 'hex')
}

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: config.pino.name })
})

router.post('/v1/raw', upload.single('gsr'), function (req, res, next) {
  const b = req.body
  if (!req.file) {
    return res.status(400).json({error: 'missing gsr attachment'})
  }
  if (req.file.originalname.length > config.gsr.file.maxLength) {
    return res.status(400).json({error: 'gsr file originalname too long'})
  }
  if (req.file.size > config.gsr.file.maxSize) {
    return res.status(400).json({error: 'gsr file too big'})
  }
  if (!b.sourceCallsign) {
    return res.status(400).json({error: 'missing sourceCallsign'})
  }
  if (!b.destinationCallsign) {
    return res.status(400).json({error: 'missing destinationCallsign'})
  }
  if (!b.meta) {
    return res.status(400).json({error: 'missing meta'})
  }

  fs.readFile(CWD + config.gsr.file.storageFolder + '/' + req.file.filename, function (err, data) {
    if (err) {
      l.error('raw-gsr-readFile', err)
    }
    const id = req.file.filename.split('_')[0]
    let fileChecksum = checksum(data, 'sha512')

    let doc = {
      _id: id,
      checksum: fileChecksum,
      filename: req.file.filename,
      createdAt: Date.now(),
      meta: b.meta,
      callsign: {
        source: b.sourceCallsign,
        destination: b.destinationCallsign
      }
    }

    db.findDupes('gsr', { checksum: doc.checksum }, function (docs) {
      if (docs.length > 0) {
        res.status(200).json({
          _id: docs[0]._id,
          filename: docs[0].filename,
          checksum: docs[0].checksum,
          status: 'ok',
          dupe: true
        })
      }
      if (docs.length === 0) {
        db.insertOne('gsr', doc, function (cb) {
          res.status(201).json({
            status: 'ok',
            checksum: fileChecksum,
            fileName: req.file.filename,
            _id: id
          })
        })
      }
    })
  })
})

module.exports = router
