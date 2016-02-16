/*
This is the game object which sould house all of the game logic dealing, playeing winning losing start, stop, save, etc...
*/


var questions = require('cah-cards/questions'),
    answers = require('cah-cards/answers'),
    _ = require("underscore");

exports.shuffle_players = function(players){
  return _.shuffle(players);
}

exports.answer_deck = function(){
  deck = [];
  for(answer in answers){
      deck.push(answers[answer]);
  };
  return deck;
};

exports.question_deck = function(){
  deck = [];
  for(question in questions){
      deck.push(questions[question]);
  };
  return deck;
};

function throw_away_deck(data){
  deck = [];
  return deck;
}

// players_n_answerDeck is an object/hash with players
// and the current games answer_deck passed in
exports.deal_cards_to_player = function(data){

  answer_cards = data.cards;
  players = data.list;
  for (var player in players) {

    for (var i = 0; i < 9; i++) {
      // TODO: randomize card drawing
      the_card = _.shuffle(answer_cards).pop()
      the_card["owner"] = player; //potential issue with multi games
      players[player].hand.push(the_card);
    };
  };

      // returns current answer_deck after dealing
      return answer_cards;
};

// not sure we need to keep track of discard pile of answers
function throw_away_card(data){

  discarded_cards = data.cards;
  throw_away_deck = data.throw_away_cards;

  for (var card in discarded_cards){
    throw_away_deck.push(card);
  };

  return throw_away_deck;

};
function question_discard(data){

  discard_deck = data.deck;
  card = data.card;

  discard_deck.push(card);
  return discard_deck;

}
function pick_winner(data){

  answer_card = data.answer_card
  winner = answer_card.owner
  // returns winning player
  return winner.owner     //potential depedency issue... maybe?

}
