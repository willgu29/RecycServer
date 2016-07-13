// AWS S3 Upload Module


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


module.exports.pushToS3 = function(keyID, audioFile) {

	//create 
	var params = {Bucket: myBucket, Key: keyID, Body: audioFile};

	s3.putObject(params, function(err, data) {
	    //console.log(data);
	    if (err)  {
	        console.log(err) 
	    } else {
	        console.log("Successfully uploaded data to "+myBucket+"/testKeyUpload");
	    }
	});

}

module.exports.pullFromS3 = function(keyID) {

	//create 
	var params = {Bucket: myBucket, Key: keyID};

	// var fileStream = s3.getObject(params).createReadStream();
	// console.log('filestream: ' + fileStream);

	s3.getObject(params, function(err, data) {
		if(err)
		{
			console.log('err');
		} else {
			console.log('noerr');
			console.log(data.Body.toString());
		}

		// if(!err)
			//console.log(data.Body.toString());
	})

}