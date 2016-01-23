var io,
    gameSocket;

exports.initConnect = function(sio, socket) {
  io = sio;
  gameSocket = socket;
  gameSocket.emit('connected', {message: "You're connected!"});
  gameSocket.on('createNewGame', onCreateNewGame);
  gameSocket.on('playerWantsToJoinGame', onPlayerWantsToJoinGame);
  gameSocket.on('startGame', onStartGame);
}

function onCreateNewGame() {
  var thisGameID = parseInt(Math.random() * 10000, 10);
  console.log('new game id: ' + thisGameID);

  this.join(thisGameID.toString());
  this.emit('newGameCreated', { gameID: thisGameID, mySocketID: this.id });

  console.log("Created room: " + thisGameID);
  console.log(gameSocket.rooms);
};

function onPlayerWantsToJoinGame(data) {
  console.log(data.playerName + " wants to join " + data.gameID);
  var sock = this;
  sock.join(data.gameID);
  io.sockets.to(data.gameID).emit('playerJoinedGame', data);
};

// how to get all clients in a given room taken from github examplt
// function onPLayerhasJionedRoom(data){
//   var io = require('socket.io')();
//   io.of(data.room).clients(function(error, clients){
//     if (error) throw error;
//     console.log(clients); // => [Anw2LatarvGVVXEIAAAD]
//   });
// };

function onStartGame(data) {
  // TODO: deal cards
  // TODO: decide player order
  // console.log(io.nsps['/'].adapter.rooms[data.room]);
  console.log(data.room + " is ready to start the game.");
  io.sockets.to(data.room).emit('gameStarted');
}