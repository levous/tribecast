const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const passport = require('passport');
const config = require('./config');
const fs = require('fs');

function setupRoutes(basepath, app){
  // load each file in the routes dir
  // dynamically include routes (Controllers)
  fs.readdirSync(basepath).forEach(function (fileOrDir){
    const fullPath = path.join(basepath, fileOrDir);
    if(fullPath.substr(-3) === '.js') {
      let route = require(fullPath);
      console.log('Setup Route', fullPath);
      route.setup(app);
    }else{
      let pathStat = fs.statSync(fullPath)
      console.log('HERE ' + fullPath, pathStat.isDirectory);
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


setupRoutes(path.join(__dirname, './server/routes'), app);

// handle every other route with index.html, which will run react front end
app.get('*', function (request, response){
  response.sendFile(path.resolve(__dirname, 'server', 'static', 'index.html'));
})

// start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT} or http://127.0.0.1:${PORT}`);
});
