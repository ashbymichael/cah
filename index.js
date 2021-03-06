/*
This is the frst place the application loads this file handles the routes and sets up the use of cookies, and application dependent resources

*/


var express    = require('express'),

    app        = express(),                // create a new express application
    http       = require('http').Server(app),  // create an http server with Node's HTTP module. // Pass it the express application
    io         = require('socket.io')(http),   //Instantiates Socket.IO
    cah        = require('./app/controllers/cah.server.js'),
    db         = require('./app/models/db.js'),
    game       = require('./app/models/games.js'),
    bodyParser = require('body-parser');


app.use(express.static('public'));
app.use(require('cookie-parser')('c)378fHR37!mfVJ30vn28S938BMjrn'));
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/bower_components', express.static(__dirname + '/bower_components'));

app.get('/', function(req, res) {
  app.use(express.static(__dirname + '/app'));
  app.use('/bower_components', express.static(__dirname + '/bower_components'));

  if (req.cookies.name) {
    console.log(req.cookies.name + " recognized.");
    // cah.onReturn(req.cookies);
  }

  res.sendFile(__dirname + '/app/views/index.html');
});

app.get('/join', function(req, res) {
  res.sendFile(__dirname + '/app/views/join.html');
});

app.post('/join', function(req, res) {
  console.log("join form received");
  res.cookie('name', req.body.name);
  res.cookie('game', req.body.game);
  res.redirect(303, '/');
});


app.post('/round/*', function(req, res){
  if (req.path != '/^\d+$/') {
    console.log("no such path/page!!!");
  } else {
  console.log("new round");
  };
});
// called when a client/user connects to the application via Socket.IO
io.on('connection', function(socket){
  console.log("a user connected");
  cah.initConnect(io, socket);
});

http.listen(8080, function() {
  console.log("running on port 8080");
});
