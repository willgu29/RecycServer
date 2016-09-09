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
		
		Session.findOne({"_id" : sessionID}, function (err, session) {
			if (err) {res.redirect('../');}
			console.log('sessionData',sessionData);
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
				// res.send(wordspaceData);
				//console.log('sessionData',sessionData);
				//console.log('wordspaceData', wordspaceData);
				// res.render("analysis", {
				// 	sessionData: JSON.parse(sessionData),
				// 	wordspaceData: wordspaceData
				// });
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
