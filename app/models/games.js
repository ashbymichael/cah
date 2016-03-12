var mongoose = require('mongoose');

var gameSchema = new mongoose.Schema({
  room_number: Number
});
mongoose.model('Game', gameSchema);
