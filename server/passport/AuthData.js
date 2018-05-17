const jwt = require('jsonwebtoken');
const config = require('config');

class AuthData{
  constructor(user) {

    //TODO: create a uuid key and store with user account rather than using user id directly.
    const payload = {
      sub: user._id
    };

    this.token = jwt.sign(payload, config.get('jwtSecret'));

    const roles = (user.accessExpiresAt && user.accessExpiresAt < new Date) ? user.roles : [];  
    
    this.userData = {
      id: user.id,
      name: user.name,
      memberUserKey: user.memberUserKey,
      roles: roles
    };
  }
}

module.exports = AuthData
