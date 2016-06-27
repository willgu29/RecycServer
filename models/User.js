var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

// define the schema
var userSchema = mongoose.Schema({
    email : String,
    password : String,
    firstName : String,
    lastName : String,
    age: Number,
    ethnicity: String,
    gender: String,
    admin: {type: Boolean, default: false}
});

// methods
// generate hash
userSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
