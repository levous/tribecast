const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const passport = require('passport');
const fs = require('fs');
const compression = require('compression');
const config = require('./config');
const authCheckMiddleware = require('./server/middleware/auth-check');
const log = require('./server/modules/log')(module);
const errorSerializer = require('./server/modules/error-handling/error-serializer')

function setupRoutes(directoryPath, app){
  const routesBasePath = path.join(__dirname, 'server/routes');
  // load each file in the routes dir
  // dynamically include routes (Controllers)
  fs.readdirSync(directoryPath).forEach(function (fileOrDir){
    const fullPath = path.join(directoryPath, fileOrDir);
    if(fullPath.substr(-3) === '.js') {
      // dynamically load route
      let route = require(fullPath);
      let basePath = fullPath.substr(routesBasePath.length, fullPath.length - routesBasePath.length - 3);
      if(basePath.substr(-6) === '/index'){
        basePath = basePath.substr(0, basePath.length-6);
      }
      log.info('********* Setup Route:', fullPath, 'base:', basePath);
      route.setup(basePath, app);
    }else{
      let pathStat = fs.statSync(fullPath);
      if(pathStat.isDirectory){
        setupRoutes(fullPath, app);
      }
    }
  });
}

//HACK:
//if(process.env.NODE_ENV === 'production'){
  config.dbUri = "mongodb://heroku:s3renBE@ds151008.mlab.com:51008/tribecast"
//}
// connect to the database and load models
require('./server/models').connect(config.dbUri);

const app = express();
const PORT = process.env.PORT || 3000;

// Compression
app.use(compression());

// tell the app to look for static files in these directories
app.use(express.static(path.join(__dirname, 'server/static/')));
app.use(express.static('./client/dist/'));
// tell the app to parse HTTP body messages
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// pass the passport middleware
app.use(passport.initialize());

// load passport strategies
const localSignupStrategy = require('./server/passport/local-signup');
const localLoginStrategy = require('./server/passport/local-login');
passport.use('local-signup', localSignupStrategy);
passport.use('local-login', localLoginStrategy);

//TODO: investigate node-sass-middleware
/*app.use(require('node-sass-middleware')({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true,
  sourceMap: true
}));*/

// pass the authorization checker middleware
app.use('/api', authCheckMiddleware);

// Dynamically load all routes
setupRoutes(path.join(__dirname, './server/routes'), app);

app.get('/break',function(req,res) {
  throw new Error('Stupid, stupid, STUPID!');
  res.send("Hello World!");
});

// Error Handlers
// only use this error handler middleware in "/api" based routes
app.use('/api', function(err, req, res, next){

  log.error(err.stack);
  let errorJson = errorSerializer.serializeErrors(err);
  res.status(500).json(errorJson);
});
// catch the rest
app.use(function(err, req, res, next){

  log.error(err.stack);

  if (res.headersSent) {
    log.warn(`Headers already sent when error (${err.name}) caught by global express handler.  Not handling.  Passing to next handler.`);
    return next(err)
  }

  if(req.accepts('html','json') === 'json'){
    let errorJson = errorSerializer.serializeErrors(err);
    res.status(500).json(errorJson);
  } else {
    //TODO: send as a formatted error page
    res.status(500).send('<h2 style="color:#aa0000">Sorry, an unhandled error has done happened</h2><div style="color:#555555">' + err.stack + '</div><br /><br /><i style="color:#ff0055">When you talk to support, tell the developers this is pretty pathetic - RZ (it ws on my TODO list)</i>');
  }
});

// handle every other route with index.html, which will run react front end
app.get('*', function (request, response){
  response.sendFile(path.resolve(__dirname, 'server', 'static', 'index.html'));
})

// start the server
app.listen(PORT, () => {
  log.info(`Server is running on http://localhost:${PORT} or http://127.0.0.1:${PORT}`);
});
