var mongoose = require('mongoose');
var player = require('./players');

var roundSchema = new mongoose.Schema({
  room: Number,  // needed?
  questionCard: ,
  answers: [{
    player: string,
    card: Array    // card answers (strings)
  }],
  winAnswer: {
    player: string,
    card: Array    // card answers (strings)
  }
});

// var exports = module.exports = {};

exports.Round = mongoose.model('Session', roundSchema);
