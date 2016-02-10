/*
This is the game object which sould house all of the game logic dealing, playeing winning losing start, stop, save, etc...
*/


var questions = require('cah-cards/questions'),
    answers = require('cah-cards/answers'),
    _ = require("underscore");

function shuffle_players(players){
  return _.shuffle(players);
};

function answer_deck(){
  deck = [];
  for(answer in answers){
      deck.push(answers[answer]);
  };
  return deck;
};

function question_deck(){
  deck = [];
  for(question in questions){
      deck.push(questions[question]);
  };
  return deck;
};

function throw_away_deck(cards_to_be_discarded){
  deck = [];
  return deck;
}

// players_n_answerDeck is an object/hash with players
// and the current games answer_deck passed in
function deal_cards_to_player(players_n_answerDeck){

  answer_cards = players_n_answerDeck.answer_deck;
  player = players_n_answerDeck.player;

    for (var i = 0; i < 9; i++) {
      // TODO: randomize card drawing
      the_card = _.shuffle(rooms[data.room].answer_cards).pop()
      the_card["owner"] = players[player].id //potential issue with multi games
      player.hand.push(the_card);
    }

    current_player_n_answers_deck = {player: player, answer_deck: answer_cards};
      // returns the players and current answer_deck after dealing
      return current_player_n_answers_deck;
};

// not sure we need to keep track of discard pile of answers
function throw_away_card(discarded_cards_n_throw_away_deck){

  discarded_cards = discarded_cards_n_throw_away_deck.cards;
  throw_away_deck = discarded_cards_n_throw_away_deck.throw_away_cards;

  for (var card in discarded_cards){
    throw_away_deck.push(card);
  };

  return throw_away_deck;

};
function question_discard(card_n_discard_deck){

  discard_deck = card_n_discard_deck.deck;
  card = card_n_discard_deck.card;

  discard_deck.push(card);
  return discard_deck;

}
function pick_winner(answer_n_question_cards){

  answer_card = answer_n_question_cards.answer_card
  winner = answer_n_question_cards.question_card
  // returns winning player
  return winner.owner     //potential depedency issue... maybe?

}
