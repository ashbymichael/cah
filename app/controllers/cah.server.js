var io,
    gameSocket,
    rooms     = {},
    questions = require('cah-cards/questions'),
    answers   = require('cah-cards/answers'),
    util      = require('util');

// sets up the event listeners for Socket.io
exports.initConnect = function(sio, socket) {
  io = sio;
  gameSocket = socket;
  gameSocket.emit('connected', {message: "You're connected!"});
  gameSocket.on('createNewGame', onCreateNewGame);
  gameSocket.on('playerWantsToJoinGame', onPlayerWantsToJoinGame);
  gameSocket.on('startGame', onStartGame);
  gameSocket.on('setReturn received by client', onSetReturn);
};

function onSetReturn() {
  console.log("client received setReturn");
}

exports.onReturn = function(cookies) {
  console.log("onReturn hit");
  console.log("id: " + gameSocket.id);
  console.log("connected: \n" + io.sockets.connected);
  // console.log(util.inspect(io.sockets.connected[gameSocket.id], {showHidden: false, depth: null}));
  io.sockets.connected[gameSocket.id].emit('setReturn',
                            { name: cookies.name, game: cookies.game });
  // this.emit('playerReturned', { name: cookies.name, game: cookies.game });
}

function onCreateNewGame() {
  var thisGameID = parseInt(Math.random() * 10000, 10);
  console.log('new game id: ' + thisGameID);
  rooms[thisGameID] = {
    players: [],
    question_cards: [],
    answer_cards: []
   };

   for(question in questions){
       rooms[thisGameID].question_cards.push(questions[question]);
   };

   for(answer in answers){
       rooms[thisGameID].answer_cards.push(answers[answer]);
   };

  this.join(thisGameID.toString());
  this.emit('newGameCreated', { gameID: thisGameID, mySocketID: this.id });

  console.log("Created room: " + thisGameID + " with SocketID: " + this.id);

};

function onPlayerWantsToJoinGame(data) {
  console.log(data.playerName + " wants to join " + data.gameID);
  var sock = this;
  sock.join(data.gameID);
  name = data.playerName
  rooms[data.gameID].players.push({id: this.id, player_name: name});
  data["rooms"] = rooms;
  data["numOfPlayer"] = io.nsps['/'].adapter.rooms[data.gameID].length - 1;
  console.log(this.adapter.rooms[data.gameID].sockets);
  io.sockets.to(data.gameID).emit('playerJoinedGame', data);
  console.log("------------------------------------------------------------");
};

// at this point data is {room: room #}
function onStartGame(data) {
  var player_list = rooms[data.room].players
  var player_cards = [];
  // randomize player order
  shuffle(rooms[data.room].players);

// for every player in game deal 10 cards form answer_cards
  for (var player in player_list) {
    for (var i = 0; i < 9; i++) {
      // TODO: randomize card drawing
      player_cards.push(rooms[data.room].answer_cards.pop());
    }
    // send cards to player
      io.sockets.connected[player_list[player].id].emit('cards', player_cards);
  }
  console.log(data.room + " is ready to start the game.");
  io.sockets.to(data.room).emit('gameStarted',
                                { players: rooms[data.room].players });
}

function shuffle(arr){
    for(var j, x, i = arr.length; i; j = Math.floor(Math.random() * i), x = arr[--i], arr[i] = arr[j], arr[j] = x);
    return arr;
}
