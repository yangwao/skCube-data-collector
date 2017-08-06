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

router.get('/v1/createdAt/:epochTimeMs', function (req, res, next) {
  let q = { createdAt: { $gt: parseInt(req.params.epochTimeMs) } }
  l.info(req.params.epochTimeMs)
  let humanDate = new Date(parseInt(req.params.epochTimeMs)).toUTCString()
  l.info('asdsa', humanDate)
  db.find('gsr', q, function (docs) {
    res.render('showgsr', {
      title: config.pino.name,
      createdAt: humanDate,
      rootDir: config.rootDir,
      docs: docs })
  })
})

router.post('/v1/raw', upload.single('gsr'), function (req, res, next) {
  const b = req.body
  l.info(req.file.mimetype)
  if (!req.file) {
    l.warn(`${req.clientIp} - gsr missing`)
    return res.status(400).json({error: 'missing gsr attachment'})
  }
  if (req.file.encoding !== '7bit') {
    l.warn(`${req.clientIp} - wrong encoding`)
    return res.status(400).json({error: 'gsr wrong encoding'})
  }
  if (req.file.mimetype !== 'text/plain') {
    l.warn(`${req.clientIp} - wrong mimetype`)
    return res.status(400).json({error: 'gsr wrong mimetype'})
  }
  if (req.file.originalname.length > config.gsr.file.maxLength) {
    l.warn(`${req.clientIp} - file originalname too long`)
    return res.status(400).json({error: 'gsr file originalname too long'})
  }
  if (req.file.size > config.gsr.file.maxSize) {
    l.warn(`${req.clientIp} - file too big`)
    return res.status(400).json({error: 'gsr file too big'})
  }
  if (!b.sourceCallsign || b.sourceCallsign.length > config.limits.callsign.source) {
    l.warn(`${req.clientIp} - sourceCallsign missing or too long`)
    return res.status(400).json({error: 'missing sourceCallsign or too long'})
  }
  if (!b.destinationCallsign || b.destinationCallsign.length > config.limits.callsign.destination) {
    l.warn(`${req.clientIp} - destinationCallsign missing or too long`)
    return res.status(400).json({error: 'missing destinationCallsign or too long'})
  }
  if (!b.meta || b.meta.length > config.limits.meta) {
    l.warn(`${req.clientIp} - meta missing or too long`)
    return res.status(400).json({error: 'missing meta or too long'})
  }

  fs.readFile(CWD + config.gsr.file.storageFolder + '/' + req.file.filename, 'hex', function (err, data) {
    if (err) {
      l.error('raw-gsr-readFile', err)
    }

    if (data.slice(0, 2) !== 'c0' || data.slice(-2) !== 'c0') {
      l.error('not-a-gsr-file', req.file.filename)
      return res.status(400).json({error: 'not a gsr file'})
    }

    const id = req.file.filename.split('_')[0]
    let fileChecksum = checksum(data, 'sha512')

    let doc = {
      _id: id,
      checksum: fileChecksum,
      filename: req.file.filename,
      createdAt: Date.now(),
      meta: b.meta,
      size: req.file.size,
      ip: req.clientIp,
      callsign: {
        source: b.sourceCallsign,
        destination: b.destinationCallsign
      }
    }

    db.findDupes('gsr', { checksum: doc.checksum }, function (dupe) {
      if (dupe.value !== null &&
        dupe.value.hasOwnProperty('checksum') &&
        dupe.value.checksum === doc.checksum) {
        res.status(200).json({
          _id: dupe.value._id,
          checksum: dupe.value.checksum,
          filename: dupe.value.filename,
          status: 'ok',
          seen: dupe.value.seen
        })
      }
      if (dupe.value === null) {
        db.insertOne('gsr', doc, function (cb) {
          res.status(201).json({
            _id: id,
            checksum: fileChecksum,
            fileName: req.file.filename,
            status: 'ok'
          })
        })
      }
    })
  })
})

module.exports = router
