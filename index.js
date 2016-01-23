var express = require('express'),

    app     = express(),                // create a new express application
    http    = require('http').Server(app),  // create an http server with Node's HTTP module. // Pass it the express application
    io      = require('socket.io')(http),   //Instantiates Socket.IO
    cah     = require('./app/controllers/cah.server.js');


app.use(express.static('public'));

app.use('/bower_components', express.static(__dirname + '/bower_components'));

app.get('/', function(req, res) {
app.use(express.static(__dirname + '/app'));
app.use('/bower_components', express.static(__dirname + '/bower_components'));
res.sendFile(__dirname + '/index.html');

});

// called when a client/user connects to the application via Socket.IO
io.on('connection', function(socket){
  console.log("a user connected");
  cah.initConnect(io, socket);
});

http.listen(8080, function() {
  console.log("running on port 8080");
});
