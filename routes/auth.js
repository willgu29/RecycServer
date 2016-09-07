var express = require('express');
var router = express.Router();
//*** auth listings //

var passport = require('passport');
var User = require('../models/User.js');
require('../config/passport.js')(passport);

router.get('/', function (req,res,next){

});


router.post('/login', function (req, res, next) {
  var email = req.body.email;
  var password = req.body.password;
  
  passport.authenticate('local', function (err, user, info) {
    if (err) {return next (err);}
    if (!user) {return res.redirect('/login'); }
    req.logIn(user, function (err) {
      if (err) { return next(err); }
      return res.redirect('/');
    })
  })(req, res, next);
});




router.get('/logout', function (req, res, next) {
  req.logout();
  res.redirect("/");
  // res.status(200).json({
  //   status: true,
  //   message: "Logged out!",
  // });
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
