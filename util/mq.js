var logger = require('./logger');



var mq = function() {
	var q = 'profilepic';

	var amqp = require('amqplib/callback_api');
	var url = null;
	var connection = null;
	var channel = null; 

	function bail(err, conn) {
		logger.error(err);
		if (conn) {
			conn.close( function() { 
				logger.error('mq connection closed')
			});
		};
	};

	var init = function() {
		url = process.env.CLOUDAMQP_URL || "amqp://localhost";
		if (connection) {
			connection.close();
			connection = null;
		}
	};

	function doSend(ch, msg, callback) {
		logger.info('[MQ] to send: ' + msg);
		var lrc = ch.sendToQueue(q, Buffer(msg));
		logger.info('[MQ] sent: ' + msg);
		return callback(null, { rc: lrc });
	};	

  var publish = function(msg, callback) {

			if (connection && channel) {
				var lrc = channel.sendToQueue(q, Buffer(msg));
				return doSend(channel, msg, callback);
			}

			logger.info('trying to connect to: ' + url);
			amqp.connect(url, function(err, conn) {
				if (err !== null) {
					bail(err);
					return callback(err, null);;
				};
				connection = conn;

				function on_channel_open(err, ch) {
					if (err !== null) {
						bail(err, conn);	
						return callback(err, null);;
					}
					channel = ch;
					ch.assertQueue(q, {durable: false}, function(err, ok) {
						if (err) {
							bail(err, conn);
							return callback(err, null);
						}
						return doSend(ch, msg, callback);
					});
				};
				conn.createChannel(on_channel_open);
			});
	};

  var consume = function(callback) {
    logger.error('mq.consume - not implemented');
		callback({err: 'mq.consume - not implemented'}, null);
  };

  var get = function(callback) {
    logger.error('mq.get - not implemented');
		callback({err: 'mq.get - not implemented'}, null);
  };

  return {
		init: init,
    publish: publish,
    consume: consume,
    get: get
  };
}();

module.exports = mq;
