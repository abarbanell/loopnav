
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
		callback('{}');	
    console.log('mq.consume() - not implemented');
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
