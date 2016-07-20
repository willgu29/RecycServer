var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.user) {
    res.redirect("/sessions");
  } else {
    res.redirect('login');
  }
});

router.get("/login", function(req, res, next) {
  res.render('login', {layout: false});
});

router.get("/createAccount", function(req, res, next) {
  res.render('createAccount', {layout: false});
});

router.get("/about", function(req, res, next) {
  res.render("about");
});

router.get('/meeting/:sessionID', function (req, res, next) {
  res.render("meeting", {id : req.params.sessionID});
});

router.get("/joinSession", function(req, res, next) {
  res.render('joinSession');
});

router.get("/createSession", function(req, res, next) {
  res.render('createSession');
});

router.get('/record', function(req, res, next) {
  res.render('record');
});

router.get('/upload', function(req, res, next) {
  res.render("upload");
});

router.get('/upload_json', function(req, res, next) {
  res.render("upload_json");
});

router.post("/upload", function(req, res, next) {
  console.log("upload");
});

function loggedIn(req, res, next) {
    if (req.user) {
        next();
    } else {
        res.redirect('/login');
    }
}

module.exports = router;
