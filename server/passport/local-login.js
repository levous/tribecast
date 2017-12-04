
const User = require('mongoose').model('User');
const PassportLocalStrategy = require('passport-local').Strategy;
const AuthData = require('./AuthData');
const errors = require('../../shared-modules/http-errors')

/**
 * Return the Passport Local Strategy object.
 */
module.exports = new PassportLocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  session: false,
  passReqToCallback: true
}, (req, email, password, done) => {
  const userData = {
    email: email.trim().toLowerCase(),
    password: password.trim()
  };

  // find a user by email address
  User.findOne({ email: userData.email }, (err, user) => {
    if (err) { return done(err); }

    if (!user) {
      return done(new errors.InvalidCredentialsError('Incorrect email or password'));
    }

    // check if a hashed user's password is equal to a value saved in the database
    return user.comparePassword(userData.password, (passwordErr, isMatch) => {
      if (err) { return done(err); }

      if (!isMatch) {
          return done(new errors.InvalidCredentialsError('Incorrect email or password'));
      }

      const authData = new AuthData(user);

      return done(null, authData.token, authData.userData);


    });
  });
});
