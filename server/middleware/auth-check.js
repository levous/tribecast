const path = require('path');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const userController = require('../controllers/UserController')
const config = require('config');
const log = require('../modules/log')(module);
const authorization = require('../../config/authorization');

//TODO: Shouldn't this just use the passport middleware?

/**
 *  The Auth Checker middleware function.
 */
module.exports = (req, res, next) => {

  const authorizedWithRole = function(user) {
    // look for configured authorization node
    const rootPath = req.baseUrl + req.path;

    const matchingNodes = authorization.filter(authNode => rootPath.toLowerCase().startsWith(authNode.route));

    if(matchingNodes){
      // sort by length and start with the most qualified path
      const sortedNodes = matchingNodes.sort((a, b) => b.route.length - a.route.length);
      const operationQualifiedNodes = sortedNodes.filter(authNode => authNode.operations && authNode.operations.length > 0);
      // inspect each operation qualified node, from most specific path to least
      for(let i = 0, l = operationQualifiedNodes.length; i < l; i++){
        const candidateNode = operationQualifiedNodes[i];

        // check for matching operation (method)
        if(candidateNode.operations.includes(req.method)){
          // operation matches and path matches.  Check roles.
          // loop each allowed role
          for(let cni = 0, cnrl = candidateNode.roles.length; cni < cnrl; cni++) {
            if(user.roles.find(role => role === candidateNode.roles[cni])){
              // matching user roles
              return true
            }
          }
          // path and operation matched, role was not present, disallowed
          return false;
        }
      }

      // operation qualified paths didn't match http method, check most specific matching path
      const candidateNode = sortedNodes[0];

      // loop each allowed role
      for(let cni = 0, cnrl = candidateNode.roles.length; cni < cnrl; cni++) {
        if(user.roles.find(role => role === candidateNode.roles[cni])){
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
    return userController.findByUserAuthenticationToken(userId)
    .then(user => {
      if(!user) {
        log.warn(`userToken: ${userId} NOT FOUND`);
        return res.status(401).end();
      }
      userController.auditAuthCheck(user);
      req.user = user;

      if(!authorizedWithRole(user)) {
        return res.status(401).json({"message":"Role Not Authorized"}).end();
      }
      return next();
    })
    .catch(userErr => {
      log.error(`userToken: ${userId} error:${err.message}`);
      return res.status(401).end();
    });
  });
};
