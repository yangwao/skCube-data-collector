const CWD = process.cwd()
const config = require(CWD + '/config.json')

const express = require('express')
const cors = require('cors')
const path = require('path')
// var favicon = require('serve-favicon')
const logger = require('morgan')
const pino = require('pino')
global.l = pino(config.pino)

const requestIp = require('request-ip')

const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')

const index = require('./routes/index')
const users = require('./routes/users')

const app = express()
app.disable('x-powered-by')
// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(requestIp.mw())

app.use(logger('dev'))
app.use(cors())
app.options('*', cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', index)
app.use('/users', users)

// log ip of origin sender
app.use(function (req, res) {
  const ip = req.clientIp
  res.end(ip)
})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
