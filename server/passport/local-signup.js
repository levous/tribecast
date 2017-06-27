const User = require('mongoose').model('User');
const PassportLocalStrategy = require('passport-local').Strategy;
const AuthData = require('./AuthData');
const userController = require('../controllers/userController');

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
    password: password.trim(),
    name: req.body.name.trim(),
    source: 'local-signup'
  };

//TODO: update this to use the userController.createUser with promise...
  const newUser = new User(userData);
  newUser.save((err) => {
    if (err) { return done(err); }

    const authData = new AuthData(newUser);

    return done(null, authData.token, authData.userData);

  });
});
