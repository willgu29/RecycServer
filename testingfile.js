// AWS Module


//***************Import Dependencies********************
var AWS = require('aws-sdk');
require('dotenv').config();



//*************Initialize AWS Config Auth***************
AWS.config.update({
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

//***************Initialize S3 bucket*********************
var s3 = new AWS.S3({ endpoint :'https://s3-us-west-2.amazonaws.com' }),
    myBucket = 'mybucket43211234';

var params = {Bucket: myBucket, Key: 'myUpload3', Body: "Test"};

s3.putObject(params, function(err, data) {
    if (err)  {
        console.log(err) 
    } else {
        console.log("Successfully uploaded data to "+myBucket+"/testKeyUpload");
    }
});