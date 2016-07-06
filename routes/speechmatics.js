var express = require('express');
var router = express.Router();

//speechmatics **/

router.post('/process', function(req, res, next) {

  //JSON transcript
  var data = req.files.get("data_file");
  console.log(data);
});


module.exports = router;
