var mongoose = require('mongoose');

var gameSchema = new mongoose.Schema({
  room_number: Number
});

var exports = module.exports = {};

exports.Game = mongoose.model('Game', gameSchema);
