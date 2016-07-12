var express = require('express');
var router = express.Router();
var Session = require("../models/Session.js");
var SessionID = require("../models/SessionID.js");
var User = require("../models/User.js");

function generateCode(){
    
    return Math.floor((Math.random() * 9999) + 1001);
}	   

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
            
            newSessionID.save(function (err){
                
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
                    
                    res.send("You're all set");
                }
            });
        }
    });
});
    
router.post('/join', function (req,res,next){

    SessionID.findOne({ 'code': req.body.code }, 'sessionID', function (err, session){
      
        //IF ALREADY MEMBER, THEN SHOW
        
        if (err) {
          res.status(400).json({
            status: false,
            session: undefined,
            message: err,
          });

        } else {
            
            Session.findByIdAndUpdate(
                session.sessionID, 
                { $addToSet: {members: req.user.id}},
                { safe: true, upsert: true, new: true},

                function(err, model) { 
                    console.log(err);
                }
            );
            
            res.send("You're all set");
        }
    }); 
});

module.exports = router;