// Testing documentation found @ http://mochajs.org/


var assert = require('assert');
var should = require('should');

// describe('Array', function() {
//   describe('#indexOf()', function() {
//     it('Should return -1 when the value is not present', function(){
//       assert.equal(-1, [1,2,3].indexOf(5));
//       assert.equal(-1, [1,2,3].indexOf(0));
//     });
//   });
// });

// Synchronous Code testing
describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      [1,2,3].indexOf(5).should.equal(-1);
      [1,2,3].indexOf(0).should.equal(-1);
    });
  });
});

// Asynchronous Code testing

// Simply invoke the callback when your test is complete. By adding a callback (usually named done) to it() Mocha will know that it should wait for completion.

describe('User', function() {
  describe('#save()', function() {
    it('should save without error', function(done) {
      var user = new User('Luna');
      user.save(function(err) {
        if (err) throw err;
        done();
      });
    });
  });
});

describe('index page', function(){
  it('should respond to GET', function(done){
    get('http://localhost:8080')
    end(function(res){
      expect(res.status).to.equal(200);
      don();
    })
  })
})
