const userController = require('../controllers/userController');
const PassportLocalStrategy = require('passport-local').Strategy;
const AuthData = require('./AuthData');


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

  userController.createUser(userData)
    .then(newUser => {
      const authData = new AuthData(newUser);
      return done(null, authData.token, authData.userData);
    })
    .catch(done)
  
});
