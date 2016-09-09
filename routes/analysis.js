require('dotenv').config();
var express = require('express');
var router = express.Router();
var wordspace = require('../analysis/test.js');
var meetingTime = require('../analysis/totalMeetingTime.js');
var multer = require('multer');
var fs = require('fs'), json;

function readJsonFileSync(filepath, encoding){

    if (typeof (encoding) == 'undefined'){
        encoding = 'utf8';
    }
    var file = fs.readFileSync(filepath, encoding);
    return JSON.parse(file);
}

function getConfig(file){

    var filepath = __dirname + '/' + file;
    return readJsonFileSync(filepath);
}

router.use(multer({dest:'./tmp'}).array('multiInputFileName'));

// analysis/...

router.get('/', function (req,res,next){
	res.send("hello");
});

router.post('/wordspace', function (req, res, next) {
  console.log('hi');
  console.log(req.body.testData);
    var inputJSONData = req.body.testData;//req.body.testData;

    // inputJSONData = JSON.parse(inputJSONData);
    // console.log('first is: ',inputJSONData[0].body)
    // console.log('first is: ',typeof(inputJSONData[0].body))
    //console.log('Input Data: ', inputJSONData.length);
    var recordings = [];
    // recordings[0] = inputJSONData[0].body;
    // console.log('recordings is: ',recordings[0])
    // console.log('recordings is: ',typeof(recordings[0]));

    for (var i = 0; i<inputJSONData.length; i++) {
      recordings[i] = inputJSONData[i].body;
      //console.log('recording',i,'is: ',JSON.parse(JSON.stringify(recordings[i])));
    }

	  //var recordings = ['./analysis/adam_1_1.json', './analysis/tanuj_1_1.json', './analysis/will_1_1.json'];
    // console.log('recordings: ', recordings);
    var data = wordspace(recordings);//session.recordingsData);
    //console.log('data: ', data);
    var meetingLength = meetingTime(recordings);
    console.log('meeting length: ', meetingLength);
    //var people = ['Steve', 'Bill', 'Will'];

    var people = [];

    for (var i=0; i<inputJSONData.length; i++) {
      people[i] = inputJSONData[i].user;
    }

    var speakingStats = [];
	
    for (var i = 0; i < data.length; i++) {
      var personData = data[i][0];
      var speakingPercent = (personData.duration/meetingLength)*100;
      var format = parseFloat(Math.round(speakingPercent * 100) / 100).toFixed(2);

      speakingStats.push({
        "wordspaceTime": personData.duration,
        "wordspacePercentage" : format,
        "name" : people[i].name,
        "gender": people[i].gender,
        "ethnicity": people[i].ethnicity,
        "age": people[i].age
      });
    }

	 
    //console.log('speakingTime', speakingTime);
    res.send({speakingStats: speakingStats, data: data, inputJSONData: inputJSONData, recordings: recordings});
		// res.send({
  //     wordspaceData: data,
  //     wordspaceMeetingLength: meetingLength,
  //     wordspaceSpeakingTime: speakingTime
  //   });
});

// router.post("/wordspace", function (req, res, next) {
//   var recordings = req.body.recordings;
//   var data = wordspace(recordings);
//   var person  = data[0][0];
//   res.send(JSON.stringify(data, null, 3));
// });

router.get('/jsonupload', function (req, res, next) {
	res.render("jsonUpload");
});

router.post('/jsonupload', function (req, res, next) {
	console.log(req.body.data);
  // var numFiles = req.files.length;
	// console.log(numFiles);
	// var filePath = [];

	// for(var i=0;i<numFiles;i++) {
	// 	filePath[i] = req.files[i].path;
	// }
	// console.log(filePath);
	// console.log(fs.readFileSync(filePath[0],'utf8'));//This is the code that reads data from the path.  Use this to extract JSON into analysis backend.
	// res.status(204).end();
	//res.render("jsonUpload");
});

router.get('/emotion', function (req, res, next) {

});

router.get('/timeline', function (req,res,next){

  // console.log(process.env.AWS_ACCESS_KEY_ID);
  
  firstJSON = getConfig('../adam_1_2.json');
  secondJSON = getConfig('../will_1_2.json');
  thirdJSON = getConfig('../tanuj_1_2.json');
  var data = [firstJSON, secondJSON, thirdJSON];
	res.render('timeline', {data: data, layout: false});
});


module.exports = router;
