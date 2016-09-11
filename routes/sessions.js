var express = require('express');
var router = express.Router();
var Session = require("../models/Session.js");
var SessionID = require("../models/SessionID.js");
var User = require("../models/User.js");
var rp = require('request-promise');

function generateCode(){

	return Math.floor((Math.random() * 99999) + 10001);
}

router.get("/", function (req, res, next) {

  //Finds all sessions this person has CREATED (not joined)
  Session
  .find({"members" : req.user.id})
  .populate("members", 'firstName lastName -_id')
  .exec(function (err, sessions) {
  	res.render("sessions", {
  		"sessions" : sessions
  	});
  })
});

router.get("/:sessionID", function (req, res, next) {
	console.log('whaddup??');

	var sessionID = req.params.sessionID;
	console.log('sessionID',sessionID);
	//'57cdbe7dea977ab025fe00b4
	rp('http://localhost:3000/aws/getObjects?prefix=' + sessionID + '/speechmatics/')
	.then(function (sessionData) {
		sessionData = JSON.parse(sessionData);
		Session.findOne({"_id" : sessionID}, function (err, session) {
			if (err) {res.redirect('../');}
			// console.log('sessionData',sessionData);
			
			var options = {
			    method: 'POST',
			    uri: 'http://localhost:3000/analysis/wordspace',
			    body: {
			        testData: sessionData
			    },
			    json: true // Automatically stringifies the body to JSON 
			};
			 
			rp(options)
			.then(function(wordspaceData) {
				//console.log('wordspaceData',wordspaceData);
				console.log('it works!');
				//res.send(wordspaceData);
				//console.log('sessionData',sessionData);
				//console.log('wordspaceData', wordspaceData);
				
				var speakingStats = wordspaceData.speakingStats;
				var individualX = [];
				var individualY = [];
				var individual = [];

				for (var i=0; i< speakingStats.length; i++) {
					individualX[i] = speakingStats[i].name;
					individualY[i] = speakingStats[i].wordspaceTime;
				}

				for (var i=0; i<individualX.length; i++) {
					individual.push([individualX[i],individualY[i]]);
				}

				console.log('individual',individual);


				var genderX = ['Male', 'Female'];
				var genderY = [0,0];
				var gender = [];

				for (var i=0; i< speakingStats.length; i++) {
					if(speakingStats[i].gender=='m') {
						genderY[0] += speakingStats[i].wordspaceTime;
					} else if(speakingStats[i].gender=='f') {
						genderY[1] += speakingStats[i].wordspaceTime;
					} else {
						console.log('error!!');
					}
				}

				for (var i=0; i<genderX.length; i++) {
					gender.push([individualX[i],individualY[i]]);
				}

				console.log('gender',gender);

				var ethnicityX = [];
				var ethnicityY = [];
				var ethnicity = [];

				for (var i=0; i< speakingStats.length; i++) {
					var index = ethnicityX.indexOf(speakingStats[i].ethnicity);
					
					if (index == -1) { //add to array
						ethnicityX.push(speakingStats[i].ethnicity);
						var indexNew = ethnicityX.indexOf(speakingStats[i].ethnicity);
						ethnicityY[indexNew] = 0;
						ethnicityY[indexNew] += speakingStats[i].wordspaceTime;
					} else {
						ethnicityY[index] += speakingStats[i].wordspaceTime;
					}
				}

				for (var i=0; i<ethnicityX.length; i++) {
					ethnicity.push([ethnicityX[i],ethnicityY[i]]);
				}

				console.log('ethnicity',ethnicity);

				res.render("analysis", {
					sessionData: sessionData,
					wordspaceData: wordspaceData,
					meetingLength: wordspaceData.inputJSONData[0].body.job.duration,
					individual: individual,
					gender: gender,
					ethnicity: ethnicity
					// individualX: individualX,
					// individualY: individualY,
					// genderX: genderX,
					// genderY: genderY,
					// ethnicityX: ethnicityX,
					// ethnicityY: ethnicityY
				});
			});
			// //put all analysis code here
			// rp('http://localhost:3000/analysis/wordspace')
			// .then(function(wordspaceData) {
			// 	//console.log('wordspaceData',wordspaceData);

			// 	res.render("analysis", {
			// 		sessionData: JSON.parse(sessionData),
			// 		wordspaceData: JSON.parse(wordspaceData)
			// 	});
			// });
		});
	})
	.catch(function (err) {
		console.log('err!!');
		console.log(err);
	});




});

router.post('/create', function (req,res,next){

	console.log(req.user);

	var newSession = Session();
	newSession.sessionName = req.body.sessionName;

	var currentUserID = req.user.id;

	newSession.leader = currentUserID;
	newSession.members.push(currentUserID);

	newSession.save(function (err, newSession){

		if (err) {
			res.status(400).json({
				status: false,
				session: undefined,
				message: err,
			});

		} else {

			var newSessionID = SessionID();
			newSessionID.sessionID = newSession.id;
			newSessionID.code = generateCode();

			newSessionID.save(function (err, newSession){

				if (err) {
					res.status(400).json({
						status: false,
						session: undefined,
						message: err,
					});

				} else {

					User.findByIdAndUpdate(
						req.user.id,
						{ $addToSet: {sessions: req.user.id}},
						{ safe: true, upsert: true, new: true},

						function(err, model) {
							console.log(err);
						}
						);
					res.render("newSession", {code : newSession.code});
				}
			});
		}
	});
});

router.post('/join', function (req,res,next){

	SessionID.findOne({ 'code': req.body.code }, 'sessionID', function (err, session){

        //IF ALREADY MEMBER, THEN SHOW

        if (err || session == undefined) {
        	res.redirect("../joinSession?validMeeting=0");
          // res.status(400).json({
          //   status: false,
          //   session: undefined,
          //   message: err,
          // });

        } else {

        	Session.findByIdAndUpdate(
        		session.sessionID,
        		{ $addToSet: {members: req.user.id}},
        		{ safe: true, upsert: true, new: true},

        		function(err, session) {

        			if (err) {
        				console.log(err);
        				return;
        			}
        			var redirectURL = "/meeting/" + session.id;

        			res.redirect(redirectURL);

        		}
        		);

        }
      });
});

router.post("/start/:sessionCode", function (req, res, next) {
	SessionID.findOne({ 'code' : req.params.sessionCode}, 'sessionID', function (err, sessionID) {
		if (err) {
			res.send(err);
			return;
		}

		Session.findOne({"_id" : sessionID.sessionID}, function (err, session) {
			if (err) {
				res.send(err);
				return;
			}
			session.status = 1;
			session.save();

			var redirectURL = "/meeting/" + session.id;

			res.redirect(redirectURL);
		});
	});
});

router.post("/end/:sessionID", function (req, res, next) {

	Session.findOne({"_id" : req.params.sessionID}, function (err, session) {
		if (err) {
			res.send(err);
			return;
		}
		session.status = 2;
		session.save();

		res.redirect("/");
	});
});


module.exports = router;
