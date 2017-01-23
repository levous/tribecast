const path = require('path');
var express = require('express');

exports.setup = function (basePath, app){

  const router = express.Router();
  router.get('/apple-touch-icon.png', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../', 'static', 'images', 'apple-touch-icon.png'));
  });

  app.use(basePath, router);
}
