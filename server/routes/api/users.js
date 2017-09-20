const express = require('express');
const errors = require('../../../shared-modules/http-errors');
const userController = require('../../controllers/userController');
const log = require('../../modules/log')(module);
const AuthData = require('../../passport/AuthData.js');
exports.setup = function (basePath, app) {
  const router = express.Router();


  //TODO: secure this to admins only?
  router.get('/', function(req, res, next){
    userController.getAll()
    .then((users) => {
      res.json({data: users});
    })
    .catch(next);
  });


  /**
   * Add User to Role - POST
   * @param {string} email - email address of user
   * @param {string} role - role to add
   * @returns "200 Success" data = {roles:[string]}
   */
  router.post('/assign-user-to-role', function(req, res, next){
    const email = req.body.email;
    const role = req.body.role;
    //TODO: Validate this shit!
    userController.findByEmail(email)
      .then(user => {
        if(!user) return next(new errors.ResourceNotFoundError('Provided email not found'));
        return userController.addUserToRole(user, role);
      }).then(user => {

        res.status(200);
        const responseBody = {
          message: `successfully added ${user.name} to ${role} role`,
          data: user.roles
        }
        return res.json(responseBody);
      })
      .catch(next);
  });

  app.use(basePath, router);
};
