var express = require('express');
var router = express.Router();

var request = require('request');
var AWS = require('aws-sdk');
AWS.config.region = 'us-west-2';



router.get("/testupload", function(req,res, next) {
  console.log('haii');
  var s3bucket = new AWS.S3({
  params: {Bucket: 'myBucket'}});
  s3bucket.createBucket(function() {
    var params = {Key: 'myKey', Body: 'Hello!'};
    s3bucket.upload(params, function(err, data) {
      if(err) {
        console.log("error uploading data: ", err);
      } else {
        console.log("Successfully uploaded data to myBucket/myKey");
      }
    });
  });
});

//speechmatics **/

router.post("/upload", function(req, res, next) {
  
  var json = {
    "data_file"    : req.body.file,
    "model"        : "en-US,",
    "notification" : "callback",
    "callback"     : "https://recyc.herokuapp.com/speechmatics/process"
  };

  var url = ("https://api.speechmatics.com/v1.0/user/3621/jobs/?auth_token="+
    process.env.AUTH_TOKEN);


  request.post(url, json, function (error, response, body){
    if (!error && response.statusCode == 200) {
      console.log(body) // Show the HTML for the Google homepage.
      res.send(body);
    } else {
      console.log(error)
      res.send(body);
    }
  });

});

router.post('/process', function(req, res, next) {

  //JSON transcript
  var data = req.files.get("data_file");
  console.log(data);
  res.send(data);

});

router.get("/test", function(req, res, next) {
  var url = ("https://api.speechmatics.com/v1.0/user/3621/jobs/?auth_token="+
    process.env.AUTH_TOKEN);

  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(body) // Show the HTML for the Google homepage.
      res.send(body);
    }
  });

});

module.exports = router;
