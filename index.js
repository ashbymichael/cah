var express = require('express'),
    app     = express(),                // create a new express application
    http    = require('http').Server(app),  //pass it the express application
    io      = require('socket.io')(http),   //Instantiates Socket.IO
    cah     = require('./cahServer.js');

app.use(express.static('public'));

app.use('/bower_components', express.static(__dirname + '/bower_components'));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

// called when a client/user connects to the application via Socket.IO
io.on('connection', function(socket){
  console.log("a user connected");
  cah.initConnect(io, socket);
});

// this code is used for managing rooms
var nsp = io.of('/' + gameID);
nsp.on('connection', function(socket){
  console.log('someone connect to' + gameID);
});
nsp.emit('hi', 'everyone!');

http.listen(8080, function() {
  console.log("running on port 8080");
});
