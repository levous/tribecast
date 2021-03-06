const express = require('express');
const enforceSSL = require('express-sslify');
const path = require('path');
const bodyParser = require('body-parser');
const passport = require('passport');
const fs = require('fs');
const compression = require('compression');
const config = require('config');
const authCheckMiddleware = require('./server/middleware/auth-check');
const log = require('./server/modules/log')(module);
const errorSerializer = require('./server/modules/error-handling/error-serializer')
const socketHandler = require('./server/modules/socket-io');

function setupRoutes(directoryPath, app){
  const routesBasePath = path.join(__dirname, 'server/routes');
  // load each file in the routes dir
  // dynamically include routes (Controllers)
  let indexFound = false;
  fs.readdirSync(directoryPath).forEach(function (fileOrDir){
    const fullPath = path.join(directoryPath, fileOrDir);
    if(fullPath.substr(-3) === '.js') {
      // dynamically load route
      const route = require(fullPath);
      const basePath = fullPath.substr(routesBasePath.length, fullPath.length - routesBasePath.length - 3);
      if(basePath.substr(-6) === '/index'){
        indexFound = true;
        // index last as it may have overridden paths
      }else{
        log.info('********* Setup Route:', fullPath, 'base:', basePath);
        route.setup(basePath, app);
      }
    }else{
      // directory? recurse
      let pathStat = fs.statSync(fullPath);
      if(pathStat.isDirectory){
        setupRoutes(fullPath, app);
      }
    }
  });
  // defered index until last
  if(indexFound) {
    const fullPath = path.join(directoryPath, 'index.js');
    const basePath = fullPath.substr(routesBasePath.length, fullPath.length - routesBasePath.length - 9); //remove /index.js
    const route = require(fullPath);
    log.info('********* Setup INDEX Route:', fullPath, 'base:', basePath);
    route.setup(basePath, app);
  }
}

// connect to the database and load models
const dbUri = config.get('dbUri');
//console.log('dbUri', dbUri);
require('./server/models').connect(dbUri);

const app = express();
const PORT = process.env.PORT || 3000;
const server = require('http').Server(app);
const io = require('socket.io')(server);// add as middleware so routes have access to io
//app.use(function(req, res, next) { console.log('>>>> request going on'); next(); });
app.use(function(req, res, next) { 'use strict'; req.io = io; next(); });

// Compression
app.use(compression());

// enforce SSL 
app.use(function (req, res, next) {
  var host = req.get('host');
  if ( app.get('env') !== 'development' && host.indexOf("localhost") !== 0 ) {
    enforceSSL.HTTPS({ trustProtoHeader: true })(req, res, next);
  } else {
    next();
  }
  
})




// tell the app to look for static files in these directories
app.use(express.static(path.join(__dirname, 'server/static/')));
app.use(express.static('./client/dist/'));
// tell the app to parse HTTP body messages
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

// pass the passport middleware
app.use(passport.initialize());

// load passport strategies
const localSignupStrategy = require('./server/passport/local-signup');
const localLoginStrategy = require('./server/passport/local-login');
const magicLinkLoginStrategy = require('./server/passport/magic-link-login');
passport.use('local-signup', localSignupStrategy);
passport.use('local-login', localLoginStrategy);
passport.use('magic-link-login', magicLinkLoginStrategy);

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
// only use this error handler middleware in "/api" and "/auth" based routes
app.use('/:var(api|auth)', function(err, req, res, next){
  const statusCode = err.status || err.statusCode || 500;
  log.error(err.stack);
  let errorJson = errorSerializer.serializeErrors(err);
  res.status(statusCode).json(errorJson);
});
// catch the rest
app.use(function(err, req, res, next){

  log.error(err.stack);

  if (res.headersSent) {
    log.warn(`Headers already sent when error (${err.name}) caught by global express handler.  Not handling.  Passing to next handler.`);
    return next(err)
  }

  const statusCode = err.status || err.statusCode || 500;
  if(req.accepts('html','json') === 'json'){
    const errorJson = errorSerializer.serializeErrors(err);
    res.status(statusCode).json(errorJson);
  } else {
    //TODO: send as a formatted error page
    res.status(statusCode).send('<h2 style="color:#aa0000">Sorry, an unhandled error has done happened</h2><div style="color:#555555">' + err.stack + '</div><br /><br /><i style="color:#ff0055">When you talk to support, tell the developers this is pretty pathetic - RZ (it ws on my TODO list)</i>');
  }
});

// handle every other route with index.html, which will run react front end
app.get('*', function (request, response){
  response.sendFile(path.resolve(__dirname, 'server', 'static', 'index.html'));
})

// start the server
server.listen(PORT, () => {
  const message = `Server is running on http://localhost:${PORT} or http://127.0.0.1:${PORT} in ${app.get('env')} mode`;
  console.log(message);
});

// socket.io
io.on('connection', socketHandler);
