var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var config = require("config");
var session = require('express-session');
var mongoose = require('mongoose');

//Set Up Server
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    secret: config.server.secret,
    name: 'eManual',
    resave: true,
    saveUninitialized: true
}));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use("/assets", express.static(path.join(__dirname, "public")));

//don't show the log when it is test
if(config.util.getEnv('NODE_ENV') !== 'test') {
    app.use(logger('dev'));
}

//Connect Databse
mongoose.connect(config.database.connectionURL);
var db = mongoose.connection;

db.on('error', function (error) {
    console.error("MongoDB connection error:");
    console.error(error);
});
db.on('open', function () {
    if(config.util.getEnv('NODE_ENV') !== 'test') {
        console.log("Connected with MongoDB!");
    }
});

//Middelware - Logging
app.use(function (req, res, next) {
  var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  console.log('Client IP:', ip);
  next();
});


//Define Routes Policy
app.use(allowAccessAllowOrigin);
app.all('/api/v1/*', isAuthorized);
//Routes
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/api/v1', require('./routes/api_v1'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

function allowAccessAllowOrigin  (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
}

function isAuthorized(req, res, next){
  var err = new Error('Not Authorized');
  err.status = 401;

  next(err);
}

module.exports = app;
