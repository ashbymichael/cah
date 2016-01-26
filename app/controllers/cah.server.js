var io,
    gameSocket;

// sets up the event listeners for Socket.io
exports.initConnect = function(sio, socket) {
  io = sio;  //why do wwe need this ????????
  gameSocket = socket;
  gameSocket.emit('connected', {message: "You're connected!"});
  gameSocket.on('createNewGame', onCreateNewGame);
  gameSocket.on('playerWantsToJoinGame', onPlayerWantsToJoinGame);
  gameSocket.on('playerHasJoinedGame', onPlayerHasJoinedGame);
  gameSocket.on('startGame', onStartGame);
}

function onCreateNewGame() {
  var thisGameID = parseInt(Math.random() * 10000, 10);
  console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
  console.log("MESSAGES from 'onCreateNewGame' callback")
  console.log('new game id: ' + thisGameID);

  this.join(thisGameID.toString());
  this.emit('newGameCreated', { gameID: thisGameID, mySocketID: this.id });

  console.log("Created room: " + thisGameID + " with SocketID: " + this.id);
  // console.log(gameSocket.id);
  console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
};

function onPlayerWantsToJoinGame(data) {
  console.log("------------------------------------------------------------");
  console.log("MESSAGES from 'onPlayerWantsToJoinGame' callback");
  console.log(data);
  console.log(data.playerName + " wants to join " + data.gameID);
  var sock = this;
  sock.join(data.gameID);
  data["numOfPlayer"] = io.nsps['/'].adapter.rooms[data.gameID].length - 1;
  console.log("server:");
  console.log(data);
  console.log(this.adapter.rooms[data.gameID].sockets);
  io.sockets.to(data.gameID).emit('playerJoinedGame', data);
  console.log("------------------------------------------------------------");
};
function onPlayerHasJoinedGame(data) {
  console.log(data + " has joined the game!");
};

function onStartGame(data) {
  // TODO: deal cards
  // TODO: decide player order
  // console.log(io.nsps['/'].adapter.rooms[data.room].length);
  console.log(data.room + " is ready to start the game.");
  io.sockets.to(data.room).emit('gameStarted');
}
