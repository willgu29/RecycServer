/**
 * Created by willgu 4/27/16
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var salt = 'imsaltyaf7';
var Crypto = require('crypto');

var UserSchema = new Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    dateCreated: { type: Date, default: Date.now},
    firstName : String,
    lastName : String,
    age: Number,
    ethnicity: String,
    gender: String,
    admin: {type: Boolean, default: false}
});

UserSchema.methods.validPassword = function(password) {
  var comparePassword = hashUserPassword(password);

  if (comparePassword == this.password) {
    return true;
  } else {
    return false;
  }
};

function hashUserPassword(password) {
  return Crypto
    .createHash('sha1')
    .update(salt + password + salt)
    .digest("hex")
    .substring(0,6);
};

// return the model

module.exports = User = mongoose.model('User', UserSchema);
