var express = require('express');
var router = express.Router();
var wordspace = require('../analysis/test.js');
var meetingTime = require('../analysis/totalMeetingTime.js');
var multer = require('multer');
var fs = require('fs');

router.use(multer({dest:'./uploads/'}).array('multiInputFileName'));

// analysis/...

router.get('/', function (req,res,next){
	res.send("hello");
});

router.get('/wordspace', function (req, res, next) {

	  var recordings = ['./analysis/adam_1_1.json', './analysis/tanuj_1_1.json', './analysis/will_1_1.json'];

    var data = wordspace(recordings);//session.recordingsData);
    var meetingLength = meetingTime(recordings);


    var people = ['Adam', 'Tanuj', 'Will'];

    var speakingTime = [];
    for (var i = 0; i < data.length; i++) {
      var personData = data[i][0];
      var speakingPercent = (personData.duration/meetingLength)*100;
      var format = parseFloat(Math.round(speakingPercent * 100) / 100).toFixed(2);

      speakingTime.push({
        "wordspace" : format,
        "name" : people[i],
      });
    }




    res.render("wordspaceExample", {
      meetingLength: meetingLength,
      speakingTime: speakingTime,
    });


});

router.post("/wordspace", function (req, res, next) {
  var recordings = req.body.recordings;
  var data = wordspace(recordings);
  var person  = data[0][0];
  res.send(JSON.stringify(data, null, 3));
});

router.get('/jsonupload', function (req, res, next) {
	res.render("jsonUpload");
});

router.post('/jsonupload', function (req, res, next) {
	var numFiles = req.files.length;
	console.log(numFiles);
	var filePath = [];

	for(var i=0;i<numFiles;i++) {
		filePath[i] = req.files[i].path;
	}
	console.log(filePath);
	console.log(fs.readFileSync(filePath[0],'utf8'));
	res.status(204).end();
	//res.render("jsonUpload");
});

router.get('emotion', function (req, res, next) {

});


module.exports = router;
