var express = require('express');
var router = express.Router();
var User = require("./models/User.js");

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//create account
router.post('/', function (req, res, next) {
  var newUser = User();
  newUser.email     = req.body.email;
  newUser.name      = req.body.name;
  newUser.age       = req.body.age;
  newUser.ethnicity = req.body.ethnicity;
  newUser.gender    = req.body.gender;

  newUser.save(function (err, user) {
    if (user) {
      res.json({"success" : true,
                "user"    : user});
    } else {
      res.json({"success" : false,
                "error"   : err});
    }
  });

  

});

module.exports = router;
