var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  dateCreated: {type: Date, default: Date.now},
  email: String,
  name: String,
  age: Number,
  ethnicity: String,
  gender: String,
  // groups: [{type: mongoose.Schema.Types.ObjectId, ref: 'Group'}],
});

module.exports = User = mongoose.model('User', userSchema);
