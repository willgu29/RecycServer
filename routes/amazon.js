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
  var objectListParams = {
  	Bucket: S3_BUCKET, /* required */
  	Prefix: testPrefix
  };
  s3.listObjectsV2(objectListParams, function(err, objectListData) {

		if (err) console.log(err, err.stack); // an error occurred
		else {
			console.log('objectListData:', objectListData);           // successful response
			//var testVar = objectListData.Contents[0].Key
			//console.log('key is', testVar);
			//console.log('filename is', testVar.split('/').pop().split('.')[0]); //extracts file name from <meetingID>/audio/<filename>.<ext>

			var contents = objectListData.Contents;

			var outputData = [];
			//console.log('hihi', contents);
			// for (var i=0; i < contents.length; i++) {
				// console.log('1');
				// var contentKey = contents[i].Key;
				// var fileName = contentKey.split('/').pop().split('.')[0];  //extracts file name from <meetingID>/audio/<filename>.<ext>);
				// console.log('filename is:', fileName);

				// s3.getObject({Bucket: S3_BUCKET, Key: contentKey}, function(err, objData) {
				// 	if (err) console.log(err, err.stack); // an error occurred
				// 	else {
				// 		console.log('2');
				// 		console.log(i);
				// 		var objReturn = {'user': fileName, 'body': JSON.parse(objData.Body.toString())};
				// 		//console.log(objReturn);
				// 		outputData.push(objReturn);
				// 		console.log(outputData);
				// 	}
				// });
				
			// }

			function syncLoop(iterations, process, exit){  
				var index = 0,
				done = false,
				shouldExit = false;
				var loop = {
						next:function(){
							if(done){
								if(shouldExit && exit){
									return exit(); // Exit if we're done
								}
							}
							// If we're not finished
							if(index < iterations){
								index++; // Increment our index
								process(loop); // Run our process, pass in the loop
							// Otherwise we're done
							} else {
								done = true; // Make sure we say we're done
								if(exit) exit(); // Call the callback on exit
							}
						},
					iteration:function(){
						return index - 1; // Return the loop number we're on
					},
					break:function(end){
						done = true; // End the loop
						shouldExit = end; // Passing end as true means we still call the exit callback
					}
				};
				loop.next();
				return loop;
			}
			
			console.log('contents length is: ', contents.length);
			syncLoop(contents.length, function(loop) {
				console.log('1');
				var i = loop.iteration();
				console.log('i is: ', i);
				var contentKey = contents[i].Key;
				var fileName = contentKey.split('/').pop().split('.')[0];  //extracts file name from <meetingID>/audio/<filename>.<ext>);
				console.log('filename is:', fileName);

				s3.getObject({Bucket: S3_BUCKET, Key: contentKey}, function(err, objData) {
					if (err) console.log(err, err.stack); // an error occurred
					else {
						console.log('2');
						console.log(i);
						var objReturn = {'user': fileName, 'body': JSON.parse(objData.Body.toString())};
						//console.log(objReturn);
						outputData.push(objReturn);
						console.log(outputData);
					}
				});
				loop.next();
			}, function() {
				console.log('done!');
			});			








}
});
});

module.exports = router;
