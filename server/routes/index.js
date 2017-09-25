const path = require('path');
var express = require('express');
const log = require('../modules/log')(module);

exports.setup = function (basePath, app){

  const router = express.Router();
  router.get('/apple-touch-icon.png', (req, res) => {
    return res.sendFile(path.resolve(__dirname, '../', 'static', 'images', 'apple-touch-icon.png'));
  });

  router.get('/offline-cache.manifest', (req, res) => {
    res.header("Content-Type", "text/cache-manifest");

    return res.sendFile(path.resolve(__dirname, '../', 'static', 'offline-cache.manifest'));
  });

  router.post ('/api/logger',  (req, res, next) => {

    logger.log(
      req.body.level || 'error',
      'Client: ' + req.body.data
    );

    return res.send( 'OK' );

  });

  app.use(basePath, router);
}
