// Amazon S3 Upload Route

//*******************Import Dependencies***************
require('dotenv').config();
var express = require('express');
var router = express.Router();
var aws = require('aws-sdk');
var AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY_ID;
var AWS_PRIVATE_KEY = process.env.AWS_SECRET_ACCESS_KEY;
var S3_BUCKET = process.env.S3_BUCKET;
console.log('s3 bucket is: ' + S3_BUCKET);

    //**********AWS Config***********
    aws.config.update({
    	accessKeyId: AWS_ACCESS_KEY,
    	secretAccessKey : AWS_PRIVATE_KEY
    });
    aws.config.region = 'us-west-2';
    var s3 = new aws.S3();


//***********************Routes************************
router.get('/sign_s3', function(req, res) {


  //******Capture Request Query******
  const fileName = req.query['file_name'];
  const fileType = req.query['file_type'];

  //Place contents into bucket param
  const s3Params = {
  	Bucket: S3_BUCKET,
  	Key: fileName,
  	Expires: 60,
  	ContentType: fileType,
  	ACL: 'public-read'
  };

  s3.getSignedUrl('putObject', s3Params, function(err, data) {
  	if(err) {
  		console.log(err);
  		return res.end();
  	}

    //place signed request and public GET url into response variable
    const returnData = {
    	signedRequest : data,
    	url: 'https://s3-us-west-2.amazonaws.com/' + S3_BUCKET + '/' + fileName
    }
    console.log('Signed Request is: ' + returnData.signedRequest);
    console.log('url is: ' + returnData.url);

    res.send(JSON.stringify(returnData));
    
  });
});

router.get('/getObjects', function(req, res) {
  //console.log('you are in');
  const testPrefix = req.query['prefix'];
  console.log('the prefix is', testPrefix);
  var params = {
  	Bucket: S3_BUCKET, /* required */
  // ContinuationToken: 'STRING_VALUE',
  // Delimiter: 'STRING_VALUE',
  // EncodingType: 'url',
  // FetchOwner: true || false,
  // MaxKeys: 0,
  Prefix: testPrefix//,
  // StartAfter: 'STRING_VALUE'
};
s3.listObjectsV2(params, function(err, data) {

if (err) console.log(err, err.stack); // an error occurred
else {
	console.log(data);           // successful response
	console.log('key is', data.Contents[0].Key);

	var objectParams = {
		Bucket: S3_BUCKET, /* required */
		Key: data.Contents[0].Key, /* required */
	};
	s3.getObject(objectParams, function(err, objData) {
		if (err) console.log(err, err.stack); // an error occurred
		else     console.log(objData.Body.toString());           // successful response
	});

}
});
})

module.exports = router;
