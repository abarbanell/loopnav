// test util/logger.js
// require logger ad check we have function error(), info()

var expect = require('expect.js');

delete process.env.LOG_LEVEL; // make sure it is unset....
var sut = require('../util/logger');

describe('logger tests', function() {

it('check default logger object', function(){
		expect(sut).to.be.ok();
    expect(sut.error).to.be.an('function');
    expect(sut.info).to.be.an('function');
  });
});
 
