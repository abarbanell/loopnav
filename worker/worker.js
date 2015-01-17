console.log('worker/worker.js - please implement me!');

var mq = require('../util/mq');

mq.publish('{"msg": "hello"}');
mq.consume();
mq.get();
