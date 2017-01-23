var express = require('express');

exports.setup = function (basePath, app){

  const router = express.Router();
  router.get('/apple-touch-icon.png', (req, res) => {
    response.sendFile(path.resolve(__dirname, 'server', 'static', 'images', 'apple-touch-icon.png'));
  });

  app.use(basePath, router);
}
