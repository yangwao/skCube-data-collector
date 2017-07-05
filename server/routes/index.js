const CWD = process.cwd()
const config = require(CWD + '/config.json')

const uuid = require('uuid')
const express = require('express')
const router = express.Router()
const multer = require('multer')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, CWD + config.storageFolder)
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname + '_' + uuid.v4())
  }
})

const upload = multer({ storage: storage})

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/sendraw', upload.single('gsr'), function(req, res, next) {
  const b = req.body

  if (req.file.size >= 267) {
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

  res.status(200).json({status: 'ok'})
})

module.exports = router;
