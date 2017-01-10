
var express = require('express');

exports.setup = function (basePath, app){

  const router = express.Router();
  router.get('/dashboard', (req, res) => {
    res.status(200).json({
      message: "You're authorized to see this secret message."
    });
  });

  app.use(basePath, router);
}
