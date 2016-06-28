var express = require('express');
var router = express.Router();
//*** auth listings //

var passport = require('passport');
var User = require('../models/User.js');
require('../config/passport.js')(passport);

router.get('/', function (req,res,next){

});

router.post('/login',
  passport.authenticate('local'),
  function (req, res, next){
    if (req.user) {
      res.redirect("/");
    } else {
      res.send("incorrect email or password");
    }
  }
);

router.get('/logout', function (req, res, next) {
  req.logout();
  res.status(200).json({
    status: true,
    message: "Logged out!",
  });
});

// check if a user is logged in
router.get('/status', function(req,res) {
  if (!req.isAuthenticated()) {
    return res.status(200).json({
      status: false
    });
  }
  res.status(200).json({
    status: true,
    id : req.user._id
  });
});



module.exports = router;
