var express = require('express');
var router = express.Router();

//*** auth listings //


router.post("/login", passport.authenticate('local'), function (req, res) {
  res.redirect('/users/');
});

router.get("/logout", function (req, res ,next) {

});





module.exports = router;
