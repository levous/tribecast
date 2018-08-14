
const userController = require('../controllers/userController')
const MagicLinkStrategy = require('./MagicLinkStrategy')
const AuthData = require('./AuthData')
const errors = require('../../shared-modules/http-errors')

/**
 * Return the Magic Link Strategy object.
 */
module.exports = new MagicLinkStrategy({
  paramName: 'magicLinkToken',
  passReqToCallback: false
}, (magicLinkToken, done) => {
  
  // find a user by magic link token
  userController.findByMagicLinkToken(magicLinkToken)
    .then(user => {
      if(!user) return done(new errors.InvalidCredentialsError('Magic link is expired or invalid'))
      
      const authData = new AuthData(user)
      return done(null, authData.token, authData.userData)
    })
    .catch(done)
});
