const express = require('express');
const path = require('path')
const bodyParser = require('body-parser');
const passport = require('passport');
const config = require('./config');

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
app.use(bodyParser.urlencoded({ extended: false }));
// pass the passport middleware
app.use(passport.initialize());

// load passport strategies
const localSignupStrategy = require('./server/passport/local-signup');
const localLoginStrategy = require('./server/passport/local-login');
passport.use('local-signup', localSignupStrategy);
passport.use('local-login', localLoginStrategy);

// pass the authorization checker middleware
const authCheckMiddleware = require('./server/middleware/auth-check');
app.use('/api', authCheckMiddleware);

// routes
const authRoutes = require('./server/routes/auth');
const apiRoutes = require('./server/routes/api');
app.use('/auth', authRoutes);
app.use('/api', apiRoutes);

// handle every other route with index.html, which will run react front end
app.get('*', function (request, response){
  response.sendFile(path.resolve(__dirname, 'server', 'static', 'index.html'));
})

// start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT} or http://127.0.0.1:${PORT}`);
});
