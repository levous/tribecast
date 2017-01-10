var express = require('express');
const memberController = require('../../controllers/memberController');

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
    const newMember = req.body.data;

    //TODO: Validate this shit!
    memberController.create(newMember)
      .then(function(member){
        // set location header for new resource
        res.location(`${req.baseUrl}/members/${member.id}`);
        // Set "Created" status
        res.status(201);
        res.json({data:member});
      })
      .catch(next);
  });

  router.get('/', function(req, res, next){
    memberController.getAll()
    .then((members) => {
      res.json({data: {members}});
    })
    .catch(next);

  });

  router.get('/:id',function(req, res, next){
    res.json({'message': 'member ${id}'});
  });

  router.put('/:id',function(req, res, next){
    res.json({'message': 'update member ${id}'});
  });

  app.use(basePath, router);
}
