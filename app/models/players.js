var mongoose = require('mongoose');

var playerSchema = new mongoose.Schema({
  name: String,
  room: Number, // needed?
  hand: Array, // array of Card objects
  points: Number,
  wonCards: Array // Array cardPair ({questionCard, answerCard[Card], round._id})
});

// var exports = module.exports = {};

exports.Player = mongoose.model('Player', playerSchema);
