var controller = require('../index.js'),
    should = require('should'),
    http = require('http');

describe('Server Test', function() {

  before(function () {
    server.listen(8080);
  });


  after(function () {
    server.close();
  });
});

describe('/', function () {
  it('should return 200', function (done) {
    http.get('http://localhost:8080', function (res) {
      should.equal(200, res.statusCode);
      done();
    });
  });
});

describe('/join', function () {
  it('should return 200', function (done) {
    http.get('http://localhost:8080/join', function (res) {
      should.equal(200, res.statusCode);
      done();
    });
  });
});
