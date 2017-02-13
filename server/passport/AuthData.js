const jwt = require('jsonwebtoken');
const config = require('../../config');

class AuthData{
  constructor(user) {

    const payload = {
      sub: user._id
    };

    this.token = jwt.sign(payload, config.jwtSecret);

    this.userData = {
      name: user.name,
      memberUserKey: user.memberUserKey
    };
  }
}

module.exports = AuthData
