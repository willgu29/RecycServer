module.exports = function(passport) {
    var LocalStrategy = require('passport-local').Strategy;
    var User = require('../models/User.js');

	  // used to serialize the user for the session
		passport.serializeUser(function(user, done) {
		  done(null, user.id);
		});
		// used to deserialize the user
		passport.deserializeUser(function(id, done) {
			User.findById(id , function(err, user) {
				done(err, user);
			});
	  });

		passport.use(new LocalStrategy({
		  usernameField: 'email',
			passwordField: 'password' },
			function(email, password, done) { User.findOne({ email: email},
			function (err, user) {
				//console.log('haii');
				if (err) { return done(err); }
				if (!user) {
					console.log('no user');
					return done(null, false, { message: 'Incorrect email.' });
				}
				if (!user.validPassword(password)) {
					console.log('no pass');
					return done(null, false, { message: 'Incorrect password.' });
				}
				console.log('go through');
					return done(null, user); });
			}
		));



};
