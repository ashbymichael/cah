var mongoose = require('mongoose');

var questionCardSchema = new mongoose.Schema({
  id: Number,
  cardType: String,
  text: String,
  numAnswers: Number,
  expansion: String
});

// var exports = module.exports = {};

exports.QuestionCard = mongoose.model('QuestionCard', questionCardSchema);
