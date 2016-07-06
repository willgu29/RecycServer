var express = require('express');
var router = express.Router();
var Session = require("../models/Session.js");
var SessionID = require("../models/SessionID.js");

function generateCode(){
    
    return Math.floor((Math.random() * 9999) + 1001);
}

router.post('/create', function (req,res,next){
    
    console.log(req.user);
    
    var newSession = Session();
    newSession.sessionName = req.body.sessionName;
    newSession.leader = req.user.id;
    

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
            res.send("You're all set");
        }
    });
});
    
router.post('/join', function (req,res,next){

    SessionID.findOne({ 'code': req.body.code }, 'sessionID', function (err, session){
      
        if (err) {
          res.status(400).json({
            status: false,
            session: undefined,
            message: err,
          });

        } else {

            Session.findByIdAndUpdate( session.sessionID, { $push: {members: req.user.id}},{safe: true, upsert: true, new: true}, function(err, model) { console.log(err);}
                                      );
        }
    });
    
});

module.exports = router;