var express = require('express');
var router = express.Router();

var request = require('request');


//speechmatics **/

"https://api.speechmatics.com/v1.0/user/3621/jobs/?auth_token=" + process.env.AUTH_TOKEN;

router.post("/upload", function(req, res, next) {
  console.log(req.body.file);
  var json = {
    "data_file"    : req.body.file,
    "model"        : "en-US,",
    "notification" : "callback",
    "callback"     : "https://recyc.herokuapp.com/speechmatics/process"
  }

  var url = ("https://api.speechmatics.com/v1.0/user/3621/jobs/?auth_token="+
    process.env.AUTH_TOKEN);

  request.post(url, json, function (error, response, body){
    if (!error && response.statusCode == 200) {
      console.log(body) // Show the HTML for the Google homepage.
      res.send(body);
    }
  });

});

router.post('/process', function(req, res, next) {

  //JSON transcript
  var data = req.files.get("data_file");
  console.log(data);
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
