var io,
    gameSocket,
    rooms = {};

// sets up the event listeners for Socket.io
exports.initConnect = function(sio, socket) {
  io = sio;  //why do wwe need this ????????
  gameSocket = socket;
  gameSocket.emit('connected', {message: "You're connected!"});
  gameSocket.on('createNewGame', onCreateNewGame);
  gameSocket.on('playerWantsToJoinGame', onPlayerWantsToJoinGame);
  gameSocket.on('startGame', onStartGame);
}

function onCreateNewGame() {
  var thisGameID = parseInt(Math.random() * 10000, 10);
  console.log('new game id: ' + thisGameID);
  rooms[thisGameID] = { players: [] };

  this.join(thisGameID.toString());
  this.emit('newGameCreated', { gameID: thisGameID, mySocketID: this.id });
};

function onPlayerWantsToJoinGame(data) {
  console.log(data.playerName + " wants to join " + data.gameID);
  var sock = this;
  sock.join(data.gameID);
  rooms[data.gameID].players.push(data.playerName);
  data["rooms"] = rooms;
  data["numOfPlayer"] = io.nsps['/'].adapter.rooms[data.gameID].length - 1;
  console.log(data);
  io.sockets.to(data.gameID).emit('playerJoinedGame', data);
};

function onStartGame(data) {
  // TODO: deal cards
  // TODO: decide player order
  // console.log(io.nsps['/'].adapter.rooms[data.room].length);
  console.log(data.room + " is ready to start the game.");
  io.sockets.to(data.room).emit('gameStarted');
}
