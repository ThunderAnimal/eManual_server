var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
var favicon = require('serve-favicon');

var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var httpsRedirect = require('express-https-redirect');

var config = require("config");

var policy = require('./app/moduls/routePolicy');


//Set Up Server
var app = express();

if(config.util.getEnv('NODE_ENV') !== 'test') {
    app.use(logger('dev'));
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({
    secret: config.server.secret,
    name: 'eManual',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use("/assets", express.static(path.join(__dirname, "public")));

//Passport Strategy
require('./app/moduls/passportStrategy')(passport);
passport.serializeUser(function(user, done) {
    done(null, user);
});
passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

//Connect Databse
mongoose.connect(config.database.connectionURL, { useMongoClient: true });
mongoose.Promise = global.Promise;

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
  //var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  //console.log('Client IP:', ip);
  next();
});


//Define Routes Policy
app.use(policy.allowAccessAllowOrigin);
if (config.util.getEnv('NODE_ENV') === 'production'){
    app.use('/', httpsRedirect());
}
app.all('/api/v1/*', policy.isAuthorized);
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

module.exports = app;
