

exports.setup = function (app) {

  // pass the authorization checker middleware
  const authCheckMiddleware = require('../../middleware/auth-check');

  app.use('/api', authCheckMiddleware);

  app.get('/api/dashboard', (req, res) => {
    res.status(200).json({
      message: "You're authorized to see this secret message."
    });
  });
}
