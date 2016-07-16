// Amazon S3 Upload Route

//*******************Import Dependencies***************
var express = require('express');
var router = express.Router();
var aws = require('aws-sdk');
var AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY_ID;
var AWS_PRIVATE_KEY = process.env.AWS_SECRET_ACCESS_KEY;
var S3_BUCKET = process.env.S3_BUCKET;
console.log('s3 bucket is: ' + S3_BUCKET);

//***********************Routes************************
router.get('/sign_s3', function(req, res) {
  //Route to get a signed url
  console.log('hiya1');
  console.log("query: ",req.query.file_name, req.query.file_type);
  
  //**********AWS Config***********
  aws.config.update({
    accessKeyId: AWS_ACCESS_KEY,
    secretAccessKey : AWS_PRIVATE_KEY
  });

  aws.config.region = 'us-west-2';
  
  //**********AWS S3 Init**********
  var s3 = new aws.S3();

  //**************Presigned URL for GET Operation************
  // var params = {Bucket: S3_BUCKET, Key: 'test1'};
  // s3.getSignedUrl('putObject', params, function(err, url) {
  //   console.log("putObject Url is | ", url);
  // });

  // var s3Params_test = {
  //   Bucket: S3_BUCKET,
  //   Key: 'test1',
  //   // ACL: 'public-read'
  // };

  // s3.getSignedUrl('getObject', s3Params_test, function(err, url) {
  //   if(err) {
  //     console.log('putObject error: ',err);
  //   } else {
  //     console.log('putting object');
  //     console.log('JSON URL is: ', JSON.stringify(url));
  //   }
  // });



  //***********Establish AWS S3 GET request*************************
  //var return_data;
  var getURL;
  var putURL;
  var s3Params_GET = {
  Bucket: S3_BUCKET,
  Key: 'key1',
  //ContentType: req.query.file_type,
  //ACL: 'public-read'
  };

  s3.getSignedUrl('getObject', s3Params_GET, function(err, url) {
    if(err) {
      console.log('error: ',err);
      throw(err);
    } else {
      console.log('GET OBJECT URL');
      getURL = JSON.stringify(url);
    }
  });

  //console.log(getURL);

  //***********Establish AWS S3 PUT request*************************
    var s3Params_PUT = {
    ACL: 'public-read',
    Bucket: S3_BUCKET,
    Key: 'key1',
    ContentType: req.query.file_type,
  };

  s3.getSignedUrl('putObject', s3Params_PUT, function(err, url) {
    if(err) {
      console.log('error: ',err);
      throw(err);
    } else {
      console.log('PUT OBJECT');
      putURL = url;
    
      var return_data = {
        URL_get : getURL,
        URL_put : putURL
      };
      console.log('return data is: ');
      console.log(JSON.stringify(return_data));
      res.write(JSON.stringify(return_data));
      res.end();
    }
  });

  //console.log(putURL);




  //var s3 = new aws.S3({ endpoint :'https://s3-us-west-2.amazonaws.com' });
  // var urlKey = 'key2';//'/'+req.query.file_name; //TODO
  // var s3_params = {
  //   Bucket: S3_BUCKET,
  //   Key: urlKey
  //   // Expires: 60,
  //   // ContentType: req.query.file_type,
  //   // ACL: 'public-read'
  // };
  // console.log('wegethere');
  // s3.getSignedUrl('getObject', s3_params, function(err, url) {
  //   console.log('URL is: ' , url);
  // });


  // console.log('doesthiswork??');
  // var urlComplete = s3.getSignedUrl('putObject', s3_params, function(err, url) {
  //   if(err) {
  //     console.log('error');
  //     console.log(err);
  //   } else {
  //     console.log("PUT OBJECT");
  //     var return_data = {
  //       signed_request : url,
  //       url : 'https://'+S3_BUCKET+'.s3.amazonaws.com'+req.query.file_name
  //     };
  //     res.write(JSON.stringify(return_data));
  //     res.end();
  //   }
  // });
  // console.log('url complete is: ');
});

module.exports = router;