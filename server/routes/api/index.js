
const express = require('express');
const errors = require('../../../shared-modules/http-errors');
const config = require('config');
const memberController = require('../../controllers/memberController');
const userController = require('../../controllers/userController');

exports.setup = function (basePath, app){

  const router = express.Router();
  router.get('/dashboard', function(req, res) {
    res.status(200).json({
      message: "You're authorized to see this secret message."
    });
  });

  router.post('/updates-since', function(req, res, next) {
    const json = req.body
    const since = json.since
    if (!since || !since.length) return next(new errors.MissingParameterError('parameter "since" Date required'))
    
    // admins will query users, otherwise, resolve with empty array
    const isUserAdmin = req.user.roles.includes("administrator")

    let queries = [
      memberController.findUpdatedSince(since),
      isUserAdmin ? userController.findUpdatedSince(since) : Promise.resolve([])
    ]

    return Promise.all(queries)
    .then(resultSets => {
      const memberResult = resultSets[0]
      const userResult = resultSets[1]
      const pollFrequency = config.get('pollFrequency')
      const message = `${memberResult.length} members and ${userResult.length} users`
      return res.status(200).json({
        message,
        members: memberResult,
        users: userResult,
        meta: {
          pollFrequency: isUserAdmin ? pollFrequency.admin : pollFrequency.default
        }
      });
    })
    .catch(next)

  });

  router.get('/*', function(req, res, next){
    next(new errors.ResourceNotFoundError());
  });

  app.use(basePath, router);
}
