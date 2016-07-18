var express = require('express');
var router = express.Router();
var User = require("../models/User.js");

/* GET users listing. */
router.get('/', function (req,res,next){
  User.find({})
    .exec(function (err, users) {
      res.json({
        status: true,
        users: users,
        message:"All users fetched!",
      });
    });
});

//create account
router.post('/', function (req, res, next) {

  var newUser = User();
  newUser.firstName = req.body.firstName;
  newUser.lastName = req.body.lastName;
  newUser.email     = req.body.email;
  newUser.password = hashUserPassword(req.body.password);
  newUser.gender    = req.body.gender;
  newUser.age       = req.body.age;
  newUser.ethnicity = req.body.ethnicity;

  newUser.save(function (err, newUser) {
      
    if (err) {
      res.status(400).json({
        status: false,
        user: undefined,
        message: err,
      });
        
    } else {
      res.status(201).json({
        status:true,
        user: newUser,
        message:"Account successfully created!",
      });
    }
});

});

var salt = 'imsaltyaf7';
var Crypto = require('crypto');
function hashUserPassword(password) {
  return Crypto
    .createHash('sha1')
    .update(salt + password + salt)
    .digest("hex")
    .substring(0,6);
};

module.exports = router;
