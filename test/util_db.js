// test util/db.js
// also check some basic mongo / mongoskin fucntionality to make sure we have connectivity

var expect = require('expect.js');

var sut = require('../util/db');

describe('util/db tests', function() {
  it('check some syntax of expect.js', function() {
    var f = function(){};
    expect(f).to.be.an('function');
    expect(f.doesnotexist).to.not.be.an('function'); // should fail
    expect(f.bind).to.be.an('function'); // Function.prototype.bind()
  })

  it('check default db object', function(){
	  expect(sut).to.be.an('function');
    expect(sut.bind).to.be.an('function'); // Function.prototype.bind()
  });
  
  it('can we open a DB?', function(){
		var db = sut('mongodb://localhost/test');
		console.log(db);
    expect(db).to.be.ok()
		expect(db.connection).to.be.an('function');
  })
  
});
 
