const express = require('express');
const multer = require('multer');
const errors = require('../../../shared-modules/http-errors');
const moment = require('moment');
const memberController = require('../../controllers/memberController');
const assetController = require('../../controllers/assetController');
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
        if(req.io) req.io.emit('member:new', {data: {editingUserID: req.user._id, member}});

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

  const upload = multer({
    storage: multer.memoryStorage(),
    // file size limitation in bytes
    limits: { fileSize: 52428800 },
  });


  //TODO: accept all three files in one request?
  router.post('/:id/profile-photo', upload.single('profile-photo'), function(req, res, next){

    const memberId = req.params.id;
    // validate id
    if (!MongooseObjectId.isValid(memberId)) return next(new errors.ResourceNotFoundError('Provided id not valid'));

    let member;
    memberController.findById(memberId)
    .then(memberResult => {
      member = memberResult;
      if(!member.profilePhoto) member.profilePhoto = {};
      return member
    })
    .then(member => {
      return assetController.publishMemberProfilePhoto(member, req.file)
    })
    .then(result => {
      fullsizeURL = result;

      member.profilePhoto.fullsizeURL = fullsizeURL;
      member.profilePhoto.thumbnailURL = fullsizeURL;
      return member.save();
    })
    .then(member => {
      const responseBody = {
        message: `successfully updated profile image for member ${member._id}`,
        data: member
      };

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
        if(req.io) req.io.emit('member:update', {data: {editingUserID: req.user._id, member}});
        res.json(responseBody);
      })
      .catch(next);
  });

  router.post('/invite-all-new', function(req, res, next){

    const urlRoot = `${req.protocol}://${req.hostname}`;
    let message = '';

    memberController.findAllInviteCandidates()
      .then(members => {
        if(!members || !members.length) return next(new errors.ResourceNotFoundError('Query for new members resulted in no matching records'));
        message += `found ${members.length} members candidate for invite`;
        return memberController.sendMemberInvites(members, urlRoot);
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

  router.post('/invite-send-again', function(req, res, next) {

    if (!req.body.since || !req.body.since.length) return next(new errors.MissingParameterError('parameter "since" Date required'));
    const since = moment(req.body.since);
    const until = moment(req.body.until);
    if(!since.isValid()) return next(new errors.InvalidArgumentError('"since" was not a valid ISO Date'));
    const maxCount = req.body.maxCount || -1;
    const urlRoot = `${req.protocol}://${req.hostname}`;
    let members = [];

    memberController.findInvitedSince(since, until)
      .then(memberResults => {
        members = memberResults;
        const memberUserKeys = members.map(member => member.memberUserKey);
        return userController.findByMemberUserKeys(memberUserKeys);
      })
      .then(users => {
        const verifiedUsers = users.filter(user => user.confirmedAt);
        return members.filter(member => !verifiedUsers.find(user => user.memberUserKey === member.memberUserKey));
      })
      .then(unconfirmedMembers => {
        let membersToInvite = unconfirmedMembers;
        if(maxCount > 0 && maxCount < membersToInvite.length) membersToInvite = membersToInvite.slice(0, maxCount);
        return memberController.sendMemberInvites(membersToInvite, urlRoot);
      })
      .then(inviteResponses => {
        const responseBody = {
          message: `resent invitation to ${inviteResponses.length} unconfirmed members having been invited since ${since.format()} until ${until.format()}`,
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
    const urlRoot = `${req.protocol}://${req.hostname}`;

    memberController.findByEmail(email)
      .then(members => {
        if(!members || !members.length) return next(new errors.ResourceNotFoundError('Provided email resulted in no matching records'));
        message += `found ${members.length} members with email ${email}`;
        return memberController.sendMemberInvites(members, urlRoot);
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

  router.post('/update-email-status', function(req, res, next){
    const data = req.body.data;

    const memberQueries = data.map(item => memberController.findByEmail(item.email));
    const userQueries = data.map(item => userController.findByEmail(item.email));
    const membersAndUsers = [...memberQueries, ...userQueries];

    Promise.all(membersAndUsers)
      .then(results => {
        let updates = [];
        results.forEach(result => {
          // member result is an array with likely one match, user result is a single item
          if(result) {
            // coerce into array
            const resultItems = Array.isArray(result) ? result : [result];

            resultItems.forEach(resultItem => {

              const emailItem = data.find(item => item.email.toLowerCase() === resultItem.email.toLowerCase());
              resultItem.emailStatus = {
                smtpCode: emailItem.smtpStatusCode,
                smtpDescription: emailItem.smtpStatusDescription,
                verifiedAt: new moment().toDate(),
                deliverable: (emailItem.smtpStatusCode < 400)
              };
              updates.push(resultItem.save());
            });
          }
        });
        return Promise.all(updates);
      })
      .then(saves => {
        return saves.map(item => {
          console.log('i', item);
          return {
            email: item.email,
            smtpCode: item.emailStatus.smtpCode,
            deliverable: item.emailStatus.addressIsDeliverable,
            itemType: (item.propertyAddress) ? 'Member': 'User'
          };
        });
      })
      .then(responseJson => {
        res.json(responseJson);
      })
      .catch(next);

  });


  app.use(basePath, router);
};
