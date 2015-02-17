var logger = require('./logger');

var q = 'profilepic';
var url = process.env.CLOUDAMQP_URL || "amqp://localhost";
var channel = require('amqplib').connect(url).then(function(conn) {
      logger.info('mq.publish - connection open - requesting channel');
      process.once('SIGINT', function() {
				logger.info('mq.consume - SIGINT received - close and exit.');
				conn.close(); 
				process.exit(130); //128 + signal number, SIGINT = 2
			});
      return conn.createChannel(); 
    }).then(null, logger.error('mq - why did we call logger.error() here??'));

var mq = function() {

  var publish = function(msg) {
      var ok = channel.then(function(ch) {
        ch.assertQueue(q);
        ch.sendToQueue(q, new Buffer(msg));
        logger.info('mq.publish - msg sent: ' + msg);
      });
      return ok;
  };

  var consume = function(callback) {
      return channel.then(function(ch) {
        var ok = ch.assertQueue(q);
        ok = ok.then(function(qok) {
          return ch.consume(q, callback, {noAck: true});
        });
        return ok.then(function(consumeOk) {
          logger.info('mq.consume - waiting for messages');
        });
      });
  };

  var get = function() {
    logger.error('mq.get - not implemented');
  };

  return {
    publish: publish,
    consume: consume,
    get: get
  };
}();

module.exports = mq;
