const winston = require('winston');
require('winston-mongodb').MongoDB;
require('winston-loggly-bulk');
const config = require('config');

// can be much more flexible than that O_o
function getLogger(module) {
  const logLevel = config.has('logger.logLevel') ? config.get('logger.logLevel') : 'debug';
  const logglyConfig = config.has('logger.Loggly') ? config.get('logger.Loggly') : {token:null, subdomain: null};
  console.log('log.getLogger/logLevel', logLevel);
  
  const path = module.filename.split('\\').slice(-2).join('\\');
  const dbUri = config.get('dbUri');
  return new winston.Logger({
      transports: [
          new winston.transports.Console({
              colorize: true,
              level: logLevel,
              label: (path.length > 30 ? `...${path.substr(-30)}` : path)
          }),
          new(winston.transports.MongoDB)({
            db : dbUri,
            collection: 'logs'
          }),
          new(winston.transports.Loggly)({
            token: logglyConfig.token,
            subdomain: logglyConfig.subdomain,
            tags: ["Winston-NodeJS"],
            json:true
          })
      ]
  });
}

module.exports = getLogger;
