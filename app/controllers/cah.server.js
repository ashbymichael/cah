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
    answer_cards: []
   };
   rooms[thisGameID].question_cards = game.question_deck();
   rooms[thisGameID].answer_cards = game.answer_deck();

  this.join(thisGameID.toString());
  this.emit('newGameCreated', { gameID: thisGameID, mySocketID: this.id });

};

function onPlayerWantsToJoinGame(data) {

  var sock = this;
  sock.join(data.gameID);
  name = data.playerName
  rooms[data.gameID].players.push({id: this.id, player_name: name, hand: [], points: 0});
  data["rooms"] = rooms;
  data["numOfPlayer"] = io.nsps['/'].adapter.rooms[data.gameID].length - 1;
  io.sockets.to(data.gameID).emit('playerJoinedGame', data);

};

function onStartGame(data) {

  var player_list = rooms[data.room].players;
  var question_card = _.shuffle(rooms[data.room].question_cards).pop();
  rooms[data.room].answer_deck = game.deal_cards_to_player({list: player_list, cards: rooms[data.room].answer_cards});

  for (var player in player_list) {
    io.sockets.connected[player_list[player].id].emit('cards', player_list[player].hand);
    };

  io.sockets.to(data.room).emit('gameStarted',
                                { players: rooms[data.room].players, question_card:  question_card});
};

function onNewRound(data){

};
