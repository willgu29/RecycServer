var express = require('express');
var router = express.Router();

// analysis/...

router.get('/', function (req,res,next){

});

router.get('wordspace', function (req, res, next) {

  Session.findOne({_id : sessionId}, function (err, session) {
    var data = adamsFunction(session.recordingsData);
    var people = session.people;
    var wordspace = data.wordspace;
    // res.status(200).json({
    //   "people" : //people ids
    //   "wordspace" : //% talking for each person
    // });
  });




});

router.get('emotion', function (req, res, next) {

});


module.exports = router;
