var mongoose = require('mongoose');

var sessionSchema = new mongoose.Schema({
  room: Number,
  players: Array,
  questionCards: Array,
  answerCards: Array,
  rounds: Array
});

// var exports = module.exports = {};

exports.Session = mongoose.model('Session', sessionSchema);
