
var q = 'profilepic';
var url = process.env.CLOUDAMQP_URL || "amqp://localhost";
var open = require('amqplib').connect(url);

var mq = function() {

  var publish = function(msg) {
    open.then(function(conn) {
      console.log('mq.publish() - connection open');
      var ok = conn.createChannel();
      ok = ok.then(function(ch) {
        ch.assertQueue(q);
        ch.sendToQueue(q, new Buffer(msg));
        console.log('mq.publish() - msg sent: ' + msg);
      });
      return ok;
    }).then(null, console.warn);
  };

  var consume = function(callback) {
    open.then(function(conn) {
      process.once('SIGINT', function() {
				console.log('mq.consume: SIGINT received.');
				conn.close(); 
				process.exit(130); //128 + signal number, SIGINT = 2
			});
      return conn.createChannel().then(function(ch) {
        var ok = ch.assertQueue(q);
        ok = ok.then(function(qok) {
          return ch.consume(q, callback, {noAck: true});
        });
        return ok.then(function(consumeOk) {
          console.log('mq.consume: waiting for messages');
        });
      });
    }).then(null, console.warn);
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
