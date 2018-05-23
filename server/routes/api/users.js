const express = require('express');
const MongooseObjectId = require('mongoose').Types.ObjectId;
const errors = require('../../../shared-modules/http-errors');
const userController = require('../../controllers/userController');
const log = require('../../modules/log')(module);
const AuthData = require('../../passport/AuthData.js');
exports.setup = function (basePath, app) {
  const router = express.Router();


  // routes are secured using auth-check middleware via /config/authorization.json
  
  router.get('/', function(req, res, next){
    userController.getAll()
    .then((users) => {
      res.json({data: users});
    })
    .catch(next);
  });

  router.put('/:id',function(req, res, next){

    const updatedUser = req.body;
    const userId = req.params.id;
    // validate id
    if (!MongooseObjectId.isValid(userId)) return next(new errors.ResourceNotFoundError('Provided id not valid'));
    // validate id === user._id if user._id was provided
    if (updatedUser._id && updatedUser._id !== userId) return next(new errors.InvalidArgumentError('User._id did not match id at location'));

    // pass to controller.update
    userController.update(userId, updatedUser)
      .then(function(user){
        if(!user) return next(new errors.ResourceNotFoundError('Provided id resulted in no matching record'));
        // set location header for new resource
        res.location(`${req.baseUrl}/users/${user.id}`);
        // Set "Success" status
        res.status(200);
        const responseBody = {
          message: `successfully updated user ${userId}`,
          data: user
        };
        if(req.io) req.io.emit('user:update', {data: {editingUserID: req.user._id, user}});
        res.json(responseBody);
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

  /**
   * Add User to Role - POST
   * @param {string} email - email address of user
   * @param {string} role - role to add
   * @returns "200 Success" data = {roles:[string]}
   */
  router.post('/remove-user-from-role', function(req, res, next){
    const email = req.body.email;
    const role = req.body.role;
    //TODO: Validate this shit!

    userController.findByEmail(email)
      .then(user => {
        if(!user) return next(new errors.ResourceNotFoundError('Provided email not found'));
        return userController.removeUserFromRole(user, role);
      }).then(user => {

        res.status(200);
        const responseBody = {
          message: `successfully removed ${user.name} from '${role}' role`,
          data: user.roles
        }
        return res.json(responseBody);
      })
      .catch(next);

  });

  app.use(basePath, router);
};
