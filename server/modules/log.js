const winston = require('winston');
const config = require('config');

// can be much more flexible than that O_o
function getLogger(module) {
  const logLevel = config.has('logger.logLevel') ? config.get('logger.logLevel') : 'debug';
  console.log('log.getLogger/logLevel', logLevel);
  const path = module.filename.split('\\').slice(-2).join('\\');
  return new winston.Logger({
      transports: [
          new winston.transports.Console({
              colorize: true,
              level: logLevel,
              label: (path.length > 30 ? `...${path.substr(-30)}` : path)
          })
      ]
  });
}

module.exports = getLogger;
