var express = require('express');
var router = express.Router();
var passport = require('passport');
//*** auth listings //


router.post("/login", passport.authenticate('local'), function (req, res) {
  res.send("hello");
});

router.get("/logout", function (req, res ,next) {

});





module.exports = router;
