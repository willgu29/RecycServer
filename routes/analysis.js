var express = require('express');
var router = express.Router();
var wordspace = require('../analysis/test.js');
// analysis/...

router.get('/', function (req,res,next){
	res.send("hello");
});

router.get('/wordspace', function (req, res, next) {

	 var recordings = ['./analysis/adam_1_1.json', './analysis/tanuj_1_1.json', './analysis/will_1_1.json'];

    var data = wordspace(recordings);//session.recordingsData);
//	var length = length(recordings);

    var person = data[0][0];
	res.send(JSON.stringify(data, null, 3));

//  Session.findOne({_id : sessionId}, function (err, session) {


    // res.status(200).json({
    //   "people" : //people ids
    //   "wordspace" : //% talking for each person
    // });
//  });

});

router.post("/wordspace", function (req, res, next) {
  var recordings = req.body.recordings;
  var data = wordspace(recordings);
  var person  = data[0][0];
  res.send(JSON.stringify(data, null, 3));
});

router.get('emotion', function (req, res, next) {

});


module.exports = router;
