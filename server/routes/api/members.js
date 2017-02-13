const express = require('express');
const errors = require('restify-errors');
const memberController = require('../../controllers/memberController');
const log = require('../../modules/log')(module);
const MongooseObjectId = require('mongoose').Types.ObjectId;

exports.setup = function (basePath, app) {
  const router = express.Router();
  /**
   * Create new Member - POST
   * @param {object} member - JSON representation of a Member
   * @returns "201 Created" upon success with a location header where the new object can be retrieved
   */
  router.post('/', function(req, res, next){
    console.log('post member', req.body);
    const newMember = req.body;

    //TODO: Validate this shit!
    memberController.create(newMember)
      .then(function(member){
        // set location header for new resource
        res.location(`${req.baseUrl}/members/${member.id}`);
        // Set "Created" status
        res.status(201);
        const responseBody = {
          message: `successfully created member ${member._id}`,
          data: member
        }
        res.json(responseBody);
      })
      .catch(next);
  });

  /**
   * publish 1-n Members - POST
   * @param [{object},...] members - Array of a Members
   * @returns Array of results:
   *        [{
   *          statusCode: Integer,
   *          statusMessage: String,
   *          errors: [err, ...]
   *          member:{JSON representation of member}
   *        }, ...]
   */
  router.post('/publish', function(req, res, next){
    console.log('post member', req.body);
    const members = req.body;

    //TODO: Validate this shit!
    memberController.publish(members)
      .then(function(memberResults){
        let statusCode = 200;
        let message = `published ${memberResults.length} members`;

        if(-1 < memberResults.findIndex(m => m === null || (m.errors && m.errors.length))){
          message += ' with errors';
          statusCode = 207;
        }
        res.status(statusCode);
        const responseBody = {
          message: message,
          data: memberResults
        }
        res.json(responseBody);
      })
      .catch(next);
  });

  router.get('/', function(req, res, next){
    memberController.getAll()
    .then((members) => {
      res.json({data: members});
    })
    .catch(next);

  });

  router.get('/:id',function(req, res, next){
    const memberId = req.params.id;
    // validate id
    if (!MongooseObjectId.isValid(memberId)) return next(new errors.ResourceNotFoundError('Provided id not valid'));

    memberController.get(memberId)
      .then(member => {
        if(!member) return next(new errors.ResourceNotFoundError('Provided id resulted in no matching record'));
        const responseBody = {
          message: `found member ${member._id}`,
          data: member
        }
        res.json(responseBody);
      })
      .catch(next);
  });

  router.put('/:id',function(req, res, next){

    const updatedMember = req.body;
    const memberId = req.params.id;
    // validate id
    if (!MongooseObjectId.isValid(memberId)) return next(new errors.ResourceNotFoundError('Provided id not valid'));
    // validate id === member._id if member._id was provided
    if (updatedMember._id && updatedMember._id !== memberId) return next(new errors.InvalidArgumentError('Member._id did not match id at location'));

    // pass to controller.update
    memberController.update(memberId, updatedMember)
      .then(function(member){
        if(!member) return next(new errors.ResourceNotFoundError('Provided id resulted in no matching record'));
        // set location header for new resource
        res.location(`${req.baseUrl}/members/${member.id}`);
        // Set "Success" status
        res.status(200);
        const responseBody = {
          message: `successfully updated member ${memberId}`,
          data: member
        };
        res.json(responseBody);
      })
      .catch(next);
  });

  app.use(basePath, router);
};
