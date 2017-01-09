exports.setup = function (app) {
  app.post('/api/members', function(req, res){
    res.render({'message': 'member list'});
  });
  app.get('/api/members/:id',function(req, res){
    res.render({'message': 'member ${id}'});
  });
}
