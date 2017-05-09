const path = require('path');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const config = require('config');
const authorization = require('../../config/authorization');

//TODO: Shouldn't this just use the passport middleware?

/**
 *  The Auth Checker middleware function.
 */
module.exports = (req, res, next) => {

  const authorizedWithRole = function(user) {
    // look for configured authorization node
    const rootPath = req.baseUrl + req.path;
    const matchingNode = authorization.find(authNode => rootPath.toLowerCase().startsWith(authNode.route));
    if(matchingNode){
      // loop each allowed role
      for(let i = 0; i < matchingNode.roles.length; i++) {
        if(user.roles.find(role => role === matchingNode.roles[i])){
          // matching user roles
          return true
        }
      }
      // no matching user role
      return false;
    }
    // not configured for role authorization
    return true;
  }

  if (!req.headers.authorization) {
    return res.status(401).end();
  }

  // get the last part from a authorization header string like "bearer token-value"
  const token = req.headers.authorization.split(' ')[1];

  // decode the token using a secret key-phrase
  return jwt.verify(token, config.get('jwtSecret'), (err, decoded) => {
    // the 401 code is for unauthorized status
    if (err) { return res.status(401).end(); }

    //TODO: as noted in ../passport/AuthData.js, use an authentication key, rather than the user id,
    //      so that the token has no permanant relationship to the user account
    const userId = decoded.sub;

    // check if a user exists
    return User.findById(userId, (userErr, user) => {
      if (userErr || !user) {
        return res.status(401).end();
      }
      req.user = user;

      if(!authorizedWithRole(user)) {
        res.status(401).json({"message":"Role Not Authorized"}).end();
      }

      return next();
    });
  });
};
