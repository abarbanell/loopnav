// dummy tests...

var expect = require('expect.js');

describe('Array bound tests', function() {
  it('should fail for 0 and 5,  out of bounds in our array', function(){
      expect([1,2,3].indexOf(5)).to.equal(-1);
      expect([1,2,3].indexOf(0)).to.equal(-1);
  });
});
