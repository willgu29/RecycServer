var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.user) {
    res.render('index');
  } else {
    res.render('landing');
  }
});

router.get("/login", function(req, res, next) {
  res.render('login', {layout: false});
});

router.get("/createAccount", function(req, res, next) {
  res.render('createAccount');
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

router.post("/upload", function(req, res, next) {
  console.log("upload");
  res.render('test');
});



module.exports = router;
