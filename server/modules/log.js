const winston = require('winston');
const ENV = process.env.NODE_ENV;

// can be much more flexible than that O_o
function getLogger(module) {
  const logLevel = (ENV === 'development') ? 'debug' : 'error';
  console.log('process.env.NODE_ENV', ENV);
  console.log('log.getLogger/logLevel', logLevel);
  const path = module.filename.split('\\').slice(-2).join('\\');
  return new winston.Logger({
      transports: [
          new winston.transports.Console({
              colorize: true,
              level: (ENV === 'development') ? 'debug' : 'error',
              label: (path.length > 30 ? `...${path.substr(-30)}` : path)
          })
      ]
  });
}

module.exports = getLogger;
