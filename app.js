require('dotenv').config();

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
var speechmatics = require("./routes/speechmatics");

var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

var hbs = require('hbs');
hbs.registerPartials('./views/partials');

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


//*******************INITIALIZE AWS*******************
// var awsS3 = require('./config/amazAWS');
// awsS3.pushToS3('key1', 'doesthisbodywork?');
//awsS3.pullFromS3('key1');


app.use('/', routes);
app.use('/users', users);
app.use('/auth', auth);
app.use('/speechmatics', speechmatics);

var AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY_ID;
var AWS_PRIVATE_KEY = process.env.AWS_SECRET_ACCESS_KEY;
var S3_BUCKET = process.env.S3_BUCKET;
var aws = require('aws-sdk');

app.get('/sign_s3', function(req, res) {
  console.log("query: ",req.query.file_name, req.query.file_type);
  aws.config.update({
    accessKeyId: AWS_ACCESS_KEY,
    secretAccessKey : AWS_PRIVATE_KEY,
    region: 'us-west-2'
  });
  var s3 = new aws.S3();
  //var s3 = new aws.S3({ endpoint :'https://s3-us-west-2.amazonaws.com' });
  var urlKey = '/'+req.query.file_name; //TODO
  var s3_params = {
    Bucket: S3_BUCKET,
    Key: urlKey,
    Expires: 60,
    ContentType: req.query.file_type,
    ACL: 'public-read'
  };
  console.log('doesthiswork??');
  s3.getSignedUrl('putObject', s3_params, function(err, data) {
    if(err) {
      console.log('hi');
      console.log(err);
    } else {
      console.log("PUT OBJECT");
      var return_data = {
        signed_request : data,
        url : 'https://'+S3_BUCKET+'.s3.amazonaws.com/'+req.query.file_name
      };
      res.write(JSON.stringify(return_data));
      res.end();
    }
  });
});

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

var connectDBLink = process.env.MONGO_DB || "mongodb://localhost/recyc";
mongoose.connect(connectDBLink);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(callback) {
	console.log("DB opened");
});

module.exports = app;
