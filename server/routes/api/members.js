const express = require('express');
const errors = require('restify-errors');
const memberController = require('../../controllers/memberController');
const userController = require('../../controllers/userController');
const log = require('../../modules/log')(module);
const MongooseObjectId = require('mongoose').Types.ObjectId;
const sendmail = require('../../modules/sendmail');
const communityDefaults = require('../../../config/community-defaults');

exports.setup = function (basePath, app) {
  const router = express.Router();
  /**
   * Create new Member - POST
   * @param {object} member - JSON representation of a Member
   * @returns "201 Created" upon success with a location header where the new object can be retrieved
   */
  router.post('/', function(req, res, next){
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
        if(req.io) req.io.emit('member:new', member);
        res.json(responseBody);
      })
      .catch(next);
  });
//>>>>>>>>>>>>> IMPORTANT >>>>>>>>>>>>>>>>
//TODO: secure this to admin role only!!!
//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

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

        const responseBody = {
          message: message,
          data: memberResults
        }
        res.status(statusCode).json(responseBody);
      })
      .catch(next);
  });

  /**
   * check for existing 1-n Members - POST
   * @param [{object},...] members - Array of a Members
   * @returns {
   *          message:
   *          data: [ // Array of results
   *             {
   *               matchingFields: ['fieldName', ...]
   *               member: {JSON representation of member}
   *             }, ...
   *           ]
   *          }
   */
  router.post('/match-check', function(req, res, next){
    const members = req.body;
    memberController.checkMatches(members)
      .then(function(matchResults){
        let statusCode = 200;
        let message = `checked ${matchResults.length} members`;

        const responseBody = {
          message: message,
          data: matchResults
        }
        res.status(statusCode).json(responseBody);
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

    memberController.findById(memberId)
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
        if(req.io) req.io.emit('member:update', member);
        res.json(responseBody);
      })
      .catch(next);
  });

  router.post('/invite-all-new', function(req, res, next){

    let message = '';


    memberController.findAllInviteCandidates()
      .then(members => {
        if(!members || !members.length) return next(new errors.ResourceNotFoundError('Query for new members resulted in no matching records'));
        message += `found ${members.length} members candidate for invite`;
        return memberController.sendMemberInvites(members);
      })
      .then(inviteResponses => {
        const responseBody = {
          message: message,
          data: inviteResponses
        }
        res.json(responseBody);
      })
      .catch(next);
  });

  router.post('/generate-invite', function(req, res, next){
    const email = req.body.email;
    let message = '';
    let inviteResponses;

    memberController.findByEmail(email)
      .then(members => {
        if(!members || !members.length) return next(new errors.ResourceNotFoundError('Provided email resulted in no matching records'));
        message += `found ${members.length} members with email ${email}`;

        //here
        return memberController.sendMemberInvites(members);
      })
      .then(inviteResponses => {
        const responseBody = {
          message: message,
          data: inviteResponses
        }
        res.json(responseBody);
      })
      .catch(next);
  });

  app.use(basePath, router);
};
