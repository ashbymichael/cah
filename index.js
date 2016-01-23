var express = require('express'),
    app     = express(),
    http    = require('http').Server(app),
    io      = require('socket.io')(http),
    cah     = require('./app/controllers/cah.server.js');

app.use(express.static('public'));

app.get('/', function(req, res) {
app.use(express.static(__dirname + '/app'));
app.use('/bower_components', express.static(__dirname + '/bower_components'));
res.sendFile(__dirname + '/index.html');

});

io.on('connection', function(socket){
  console.log("a user connected");
  cah.initConnect(io, socket);
});

// this code is used for managing rooms
// var nsp = io.of('/' + gameID);
// nsp.on('connection', function(socket){
//   console.log('someone connect to' + gameID);
// });
// nsp.emit('hi', 'everyone!');

http.listen(8080, function() {
  console.log("running on port 8080");
});
