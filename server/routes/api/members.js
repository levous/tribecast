
const memberController = require('../../controllers/memberController');

exports.setup = function (app) {
  //TODO: should we infer the web path based on the directory path?  Could be sent in as a param or computed using __dirname

  /**
   * Create new Member - POST
   * @param {object} member - JSON representation of a Member
   * @returns "201 Created" upon success with a location header where the new object can be retrieved
   */
  app.post('/api/members', function(req, res){
    const newMember = req.body.data;
    //TODO: Validate this shit!
    memberController.create(newMember)
      .then(function(member){
        res.location = 'hello';
        res.json(newMember)
        console.log('Aw Yah', member);
      })
      .catch(function(error){
        console.log('Aw Crap', error);
      });

  });

  app.get('/api/members', function(req, res){
    memberController.getAll()
    .then((members) => {
      res.json({'members': members});
    })
    .catch((error) => {
      console.log('CRAP');
    });

  });

  app.get('/api/members/:id',function(req, res){
    res.json({'message': 'member ${id}'});
  });

  app.put('/api/members/:id',function(req, res){
    res.json({'message': 'update member ${id}'});
  });
}
