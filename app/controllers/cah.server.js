/*
This file is called by index.js. Here we set up the Socket.io interface and also establish the application lifecycle with promises.callbacks
*/

var io,
    gameSocket,
    rooms     = {},
    question_deck = [],
    answer_deck = [],
    util      = require('util'),
    game = require('../models/cah.game'),
    _ = require("underscore");

// sets up the event listeners for Socket.io
exports.initConnect = function(sio, socket) {

  io = sio;
  gameSocket = socket;
  gameSocket.emit('connected', {message: "You're connected!"});
  gameSocket.on('createNewGame', onCreateNewGame);
  gameSocket.on('playerWantsToJoinGame', onPlayerWantsToJoinGame);
  gameSocket.on('startGame', onStartGame);

};

exports.onReturn = function(cookies) {

  console.log("onReturn hit");
  console.log("id: " + gameSocket.id);
  // io.sockets.emit('setReturn', { name: cookies.name, game: cookies.game });
};

function onCreateNewGame() {

  var thisGameID = parseInt(Math.random() * 10000, 10);
  rooms[thisGameID] = {
    players: [],
    question_cards: [],
    answer_cards: [],
    current_czar: {},
    current_question: {},
    played_cards: []
   };
   rooms[thisGameID].question_cards = game.question_deck();
   rooms[thisGameID].answer_cards = game.answer_deck();

  this.join(thisGameID.toString());
  this.emit('newGameCreated', { gameID: thisGameID, mySocketID: this.id });

};

function onPlayerWantsToJoinGame(data) {
  if (rooms[data.gameID]) {
    var sock = this;
    sock.join(data.gameID);
    // name = data.playerName;
    rooms[data.gameID].players.push({id: this.id,
                                     player_name: data.playerName,
                                     hand: [],
                                     points: 0});
    data['rooms'] = rooms;
    data['numOfPlayer'] = io.nsps['/'].adapter.rooms[data.gameID].length - 1;
    io.sockets.to(data.gameID).emit('playerJoinedGame', data);
  } else {
    console.log("Player " + data.playerName + " requested invalid game " + data.gameID);
    gameSocket.emit('gameIDNotValid', data);
  }
};

function onStartGame(data) {

  var room = rooms[data.room],
      player_list = _.shuffle(room.players);

  room.question_card = _.shuffle(room.question_cards).pop();
  room.answer_deck = game.deal_cards_to_player({list: player_list, cards: room.answer_cards});
  room.current_czar = player_list[0];

  for (var player in player_list) {
    io.sockets.connected[player_list[player].id].emit('cards', player_list[player].hand);
    };

  io.sockets.to(data.room).emit('gameStarted', room);
};

function onNewRound(data){

};
