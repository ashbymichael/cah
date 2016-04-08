var mongoose = require('mongoose');

var answerCardSchema = new mongoose.Schema({
  id: Number,
  cardType: String,
  text: String,
  expansion: String
});

// var exports = module.exports = {};

exports.AnswerCard = mongoose.model('AnswerCard', answerCardSchema);
