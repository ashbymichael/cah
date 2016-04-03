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
    db         = require('../models/db.js'),
    games       = require('../models/games.js'),
    mongoose   = require('mongoose'),
    _ = require("underscore");

// sets up the event listeners for Socket.io
exports.initConnect = function(sio, socket) {

  io = sio;
  gameSocket = socket;
  gameSocket.emit('connected', {message: "You're connected!"});
  gameSocket.on('createNewGame', onCreateNewGame);
  gameSocket.on('playerWantsToJoinGame', onPlayerWantsToJoinGame);
  gameSocket.on('startGame', onStartGame);
  gameSocket.on('playedCard', onPlayedCard);

};

exports.onReturn = function(cookies) {

  console.log("onReturn hit");
  console.log("id: " + gameSocket.id);
};

function onCreateNewGame() {

  var newGame = new games.Game({
    room_number: parseInt(Math.random() * 10000, 10),
    players: [],
    question_cards: [],
    answer_cards: [],
    played_cards: []
  });

  var thisGameID = newGame.room_number;

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

   newGame.question_cards = game.question_deck();
   newGame.answer_cards = game.answer_deck();

   newGame.save(function(err, newGame){
     if (err){
       return console.error(err);
     }
   });

  this.join(thisGameID.toString());
  this.emit('newGameCreated', { gameID: thisGameID, mySocketID: this.id });

};

function onPlayerWantsToJoinGame(data) {
  if (rooms[data.gameID]) {
    var sock = this;
    sock.join(data.gameID);

    rooms[data.gameID].players.push({id: this.id,
                                     player_name: data.playerName,
                                     hand: [],
                                     points: 0});

    // mongoose.model('Game').find({}, function(err,games){
    //   console.log(games);
    // })

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

  //  Experimental
  var test = "I am a test."

  var michael = mongoose.model('Game').find({room_number: data.room}, function(err, game){
    test = "Another string";
    console.log("Inside michael promise: " + test);
  });

  michael.then(function(return_val) {
    console.log(return_val[0].room_number);
  });

  io.sockets.to(data.room).emit('gameStarted', room);
};

function onPlayedCard(data){
   console.log(data.played_cards);
   io.sockets.connected[data.current_czar.id].emit('reloadCzar', data);

};

function onNewRound(data){

};
