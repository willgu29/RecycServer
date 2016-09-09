// Amazon S3 Upload Route

//*******************Import Dependencies***************
require('dotenv').config();
var express = require('express');
var router = express.Router();
var aws = require('aws-sdk');
var AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY_ID;
var AWS_PRIVATE_KEY = process.env.AWS_SECRET_ACCESS_KEY;
var S3_BUCKET = process.env.S3_BUCKET;
var User = require("../models/User.js");
console.log('s3 bucket is: ' + S3_BUCKET);

    //**********AWS Config***********
    aws.config.update({
    	accessKeyId: AWS_ACCESS_KEY,
    	secretAccessKey : AWS_PRIVATE_KEY
    });
    aws.config.region = 'us-west-2';
    var s3 = new aws.S3();

    //Uses bluebird implementation of promise
    aws.config.setPromisesDependency(require('bluebird'));

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

	// Capture 'prefix' query parameter
	const testPrefix = req.query['prefix'];

	var objectListParams = {
		Bucket: S3_BUCKET,
		Prefix: testPrefix
	};

	s3.listObjectsV2(objectListParams, function(err, objectListData) {

		// If there was an error in getting objects, throw exception
		if (err) console.log(err, err.stack);

		// We found the list of Objects
		else {

			// This object contains the list of Data Object's Metadata
			//console.log('objectListData:', objectListData);

			// Extract the contents of the objectList
			var contents = objectListData.Contents;
			console.log('contents is: ',contents)

			// This is the "For" implementation function that will be used to circumvent the synchronous-Async for loop paradigm
			// https://zackehh.com/handling-synchronous-asynchronous-loops-javascriptnode-js/
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
			// Create the array that will store the results of the retrieval operation
			var outputArr = [];

			syncLoop(contents.length, function(loop) {

				// Capture loop iteration number
				var i = loop.iteration();
				console.log('i is: ', i);

				// Capture the 'i'th key in the contents array
				var contentKey = contents[i].Key;

				// Create a getObjectPromise that will only run the next loop iteration once the promise is fulfilled
				var getObjectPromise = s3.getObject({Bucket: S3_BUCKET, Key: contentKey}).promise();

				// Create the function that will return on object retrieval
				getObjectPromise.then(function(data) {

					// Extract the filename from the 'key' string.
					// Extracts file name from <meetingID>/audio/<filename>.<ext>
					var fileName = contentKey.split('/').pop().split('.')[0];

					// Extract Body content from the data payload.
					// Initally returned as a buffer.  So, Buffer.toString() stringifies it.
					// JSON.parse puts this in correct format for display
					var dataBody = JSON.parse(data.Body.toString());

					//Get User Statistics
					var userProfile = {};
					User.findById(fileName, function (err, myDocument) {
  						if (err) {console.log('error in finding user!!'); throw (err);}
  						userProfile.name = myDocument.firstName;
  						userProfile.age = myDocument.age;
  						userProfile.ethnicity = myDocument.ethnicity;
  						userProfile.gender = myDocument.gender;
  						console.log('userprofile is: ',userProfile);
						
						// Create bundling object from acquired data
						var objReturn = {'user': userProfile, 'body': dataBody};

						// Push this object back into the output Array
						outputArr.push(objReturn);

						// All functions have been pushed for this object.  Therefore, move onto next Object
						loop.next();
					});
					


				});				
			}, function() {

				// After finishing all data retrieval, send this as a HTTP response
				res.send(JSON.stringify(outputArr));
			});			
		}
	});
});

module.exports = router;
