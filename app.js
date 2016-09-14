require('dotenv').config();

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var session = require('express-session')
var socketio = require('socket.io');

var routes = require('./routes/index');
var users = require('./routes/users');
var auth = require('./routes/auth');
var speechmatics = require("./routes/speechmatics");
var amazonAWS = require('./routes/amazon');
var sessions = require('./routes/sessions');
var analysis = require('./routes/analysis');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

var hbs = require('hbs');

hbs.registerPartials('./views/partials');

hbs.registerHelper('toJSON', function(obj) {
  return JSON.stringify(obj);
});


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'analysis')));


app.use(bodyParser());
app.use(session({ secret: 'keyboard cat' }));
app.use(passport.initialize());
app.use(passport.session());

// app.all('*', loggedIn);


// http://stackoverflow.com/questions/12921658/use-specific-middleware-in-express-for-all-paths-except-a-specific-one
function loggedIn(req, res, next) {
    var _=require('underscore');
    var nonSecurePaths = ['/', '/login', '/auth/login', '/analysis/timeline', '/aws/getObjects', '/createAccount'];
    if(_.contains(nonSecurePaths, req.path)) return next();

    if(req.path == '/login') {
      return next();
    }
    if (req.user) {
        return next();
    } else {
      console.log('redirecting');
        res.redirect('/login');
    }
}

app.use('/', routes);
app.use('/users', users);
app.use('/auth', auth);
app.use('/analysis', analysis);
app.use("/speechmatics", speechmatics);
app.use('/sessions', sessions);
app.use('/aws', amazonAWS);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

/// MONGOOOSE Database Linking ****
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var connectDBLink = process.env.MONGO_DB || "mongodb://localhost/recyc";
mongoose.connect(connectDBLink);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(callback) {
	console.log("DB opened");
});

module.exports = app;
