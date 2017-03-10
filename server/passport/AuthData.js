const jwt = require('jsonwebtoken');
const config = require('config');

class AuthData{
  constructor(user) {

    //TODO: create a uuid key and store with user account rather than using user id directly.
    const payload = {
      sub: user._id
    };

    this.token = jwt.sign(payload, config.get('jwtSecret'));
    this.userData = {
      name: user.name,
      memberUserKey: user.memberUserKey,
      roles: user.roles
    };
  }
}

module.exports = AuthData
