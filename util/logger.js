var logger = function() {

  var winston = require('winston');
  require('winston-papertrail').Papertrail;

  var wlogger = new winston.Logger({
    levels: {
        debug: 0,
        info: 1,
        warn: 2,
        error: 3
    },
    transports: [
      new winston.transports.Papertrail({
        host: 'logs2.papertrailapp.com',
        port: 33169,
        program: 'loopnav',
        colorize: true
      })
    ]
  });

  wlogger.info('winston logger for Papertrail created.');

  return wlogger;
}();

module.exports = logger;