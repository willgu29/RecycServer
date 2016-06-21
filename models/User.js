var mongoose = require('mongoose');
var EventTag = require('./EventTag');

var userSchema = new mongoose.Schema({
  dateCreated: {type: Date, default: Date.now},
  email: String,
  name: String,
  phoneNumber: String,
  status: Number, //0 = Discontinued Service (#stop), 1 = (#hi),
  statusLastUpdate: Date,
  groups: [{type: mongoose.Schema.Types.ObjectId, ref: 'Group'}],
});

module.exports = User = mongoose.model('User', userSchema);
