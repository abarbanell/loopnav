
var q = 'profilepic';
var url = process.env.CLOUDAMQP_URL || "amqp://localhost";
var channel = require('amqplib').connect(url).then(function(conn) {
      console.log('mq.publish() - connection open - requesting channel');
      process.once('SIGINT', function() {
				console.log('mq.consume: SIGINT received.');
				conn.close(); 
				process.exit(130); //128 + signal number, SIGINT = 2
			});
      return conn.createChannel(); 
    }).then(null, console.warn);

var mq = function() {

  var publish = function(msg) {
      var ok = channel.then(function(ch) {
        ch.assertQueue(q);
        ch.sendToQueue(q, new Buffer(msg));
        console.log('mq.publish() - msg sent: ' + msg);
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
          console.log('mq.consume: waiting for messages');
        });
      });
  };

  var get = function() {
    console.log('mq.get() - not implemented');
  };

  return {
    publish: publish,
    consume: consume,
    get: get
  };
}();

module.exports = mq;
