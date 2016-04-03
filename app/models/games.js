var mongoose = require('mongoose');

var gameSchema = new mongoose.Schema({
  room_number: Number,
  players: Array,
  question_cards: Array,
  answer_cards: Array,
  played_cards: Array
});

var exports = module.exports = {};

exports.Game = mongoose.model('Game', gameSchema);
