const express = require('express');
const errors = require('restify-errors');
const memberController = require('../../controllers/memberController');
const log = require('../../modules/log')(module);
exports.setup = function (basePath, app) {
  //TODO: should we infer the web path based on the directory path?  Could be sent in as a param or computed using __dirname
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

  router.get('/', function(req, res, next){
    memberController.getAll()
    .then((members) => {
      res.json({data: members});
    })
    .catch(next);

  });

  router.get('/:id',function(req, res, next){
    const memberId = req.params.id;
    if (!memberId) return next(new errors.MissingParameterError('id not provided'));
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
    // verify that req.params.id == req.body.id
    const updatedMember = req.body;
    const memberId = req.params.id;
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
        }
        res.json(responseBody);
      })
      .catch(next);
  });

  app.use(basePath, router);
}