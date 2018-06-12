
const express = require('express');
const errors = require('../../../shared-modules/http-errors');

exports.setup = function (basePath, app){

  const router = express.Router();
  router.get('/dashboard', function(req, res) {
    res.status(200).json({
      message: "You're authorized to see this secret message."
    });
  });

  router.post('/updates-since', function(req, res) {
    res.status(200).json({
      message: "Fake out.",
      members: [],
      users: []
    });
  });

  router.get('/*', function(req, res, next){
    next(new errors.ResourceNotFoundError());
  });

  app.use(basePath, router);
}
