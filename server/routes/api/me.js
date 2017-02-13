const express = require('express');
const errors = require('restify-errors');
const memberController = require('../../controllers/memberController');
const log = require('../../modules/log')(module);
const MongooseObjectId = require('mongoose').Types.ObjectId;

exports.setup = function (basePath, app) {
  const router = express.Router();
  /**
   * Assign Member record to current authenticated User - POST
   * @param String memberId - id of my Member record
   * @returns "200 Success" upon successful save
   */
  router.post('/assign-user-member', (req, res, next) => {

    // retrieve user as applied by passport
    const user = req.user;

    if(!user) return next(new errors.UnauthorizedError('User not authenticated by System'));
    const memberId = req.body.memberId;
    // validate id
    if (!MongooseObjectId.isValid(memberId)) return next(new errors.ResourceNotFoundError('Provided id not valid'));
    // pass to controller.assignUserMember
    memberController.assignUserMember(user.id, memberId)
    .then(nada => {
      
      // Set "Success" status
      res.status(200);
      const responseBody = {
        message: `successfully assigned member ${memberId} to current user`,
        data: null
      };
      res.json(responseBody);
    })
    .catch(next);
  });
  app.use(basePath, router);

};
