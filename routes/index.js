var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/record', function(req, res, next) {
  res.render('record');
});

router.get('/upload', function(req, res, next) {
  res.render('test');
});

router.post("/upload", function(req, res, next) {
  console.log("upload");
  res.render('test');
});


module.exports = router;
