var AWS = require('aws-sdk');

/**
 * Don't hard-code your credentials!
 * Export the following environment variables instead:
 *
 * export AWS_ACCESS_KEY_ID='AKID'
 * export AWS_SECRET_ACCESS_KEY='SECRET'
 */

// Set your region for future requests.
AWS.config.update({
	accessKeyId: 'AKIAI6VDDYGOTATRH34A',
	secretAccessKey: 'yE+EtKLe0WVzGMI27tz4uC8tIMdrv4U519F6z2bQ'
});
var s3 = new AWS.S3({ endpoint :'https://s3-us-west-2.amazonaws.com' }),
    myBucket = 'mybucket43211234';

var params = {Bucket: myBucket, Key: 'myUpload', Body: "Test"};

s3.putObject(params, function(err, data) {
    if (err)  {
        console.log(err) 
    } else {
        console.log("Successfully uploaded data to "+myBucket+"/testKeyUpload");
    }
});