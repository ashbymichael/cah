controller = require('../index.js');
http_mocks = require('node-mocks-http');
should = require('should');

function buildResponse(){
  return http_mocks.createResponse({
    eventEmitter: require('events').EventEmitter
  });
};

describe('Server Controller Test', function(){

  it('should reponse to "GET" index', function(){
    var response = buildResponse();
    var request = http_mocks.createRequest({
      method: 'GET',
      url: '/',
    });

    response.on('end', function(){
      console.log(response._getData());
      response._getData().should.equal('');
      done();
    });

    controller.handle(request, response);
  });

  it ('Should fail "POST" index', function(done){
    var response = buildResponse();
    var request = http_mocks.createRequest({
      method: 'POST',
      url: '/',
    });

    response.on('end', function(){
      // POST method Should not exist.
      // this part of the code should never execute.
      done(new Error("Recieved a response"));
    });

    controller.handle(request, response, function(){
      done();
    });
  });
});
