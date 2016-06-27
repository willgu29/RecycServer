var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var session = require('express-session')


var routes = require('./routes/index');
var users = require('./routes/users');
var auth = require('./routes/auth');

var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser());
app.use(session({ secret: 'keyboard cat' }));
app.use(passport.initialize());
app.use(passport.session());


app.use('/', routes);
app.use('/users', users);
app.use('/auth', auth);

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


/////PASSPORT Session///////////////
// var LocalStrategy = require('passport-local').Strategy;
// var User = require('./models/User.js');
//
// passport.use(new LocalStrategy({
// 		usernameField: "email",
// 		passwordField: "password"
// 	},
// 	function (email, password, done) {
// 		User.findOne({email: email}, function (err, user) {
// 			if (err) {return done(err);}
// 			if (!user) {
// 				console.log("Incorrect email");
//        			return done(null, false, { message: 'Incorrect email.' });
//       		}
//       		if (!(user.password == password)) {
//       			console.log("Incorrect password");
//         		return done(null, false, { message: 'Incorrect password.' });
//       		}
//       		return done(null, user);
// 		});
// 	}
// ));
//
// passport.serializeUser(function(user, done) {
//   done(null, user.id);
// });
//
// passport.deserializeUser(function(id, done) {
//   User.findById(id, function (err, user) {
//     done(err, user);
//   });
// });

/// MONGOOOSE Database Linking ****
var mongoose = require('mongoose');

var connectDBLink = process.env.MONGO_DB || "mongodb://localhost/recyc";
mongoose.connect(connectDBLink);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(callback) {
	console.log("DB opened");
});

module.exports = app;
