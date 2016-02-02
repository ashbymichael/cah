// Most of this will likely live on the cah.server.js (e.g. onCreateNewGame ) or cah.client.js (e.g. loadPlayerDisplay)

require("cah-cards")
var _ = require("underscore")

var questions = require("cah-cards/questions");
var answers = require("cah-cards/answers");

var questions_array = [];
var answers_array = [];

for(question in questions){
    questions_array.push(questions[question]);
};

for(answer in answers){
    answers_array.push(answers[answer]);
};

var czar_cards = function(){
    return _.sample(questions_array, 1);
};

var player_cards = function(){
    return _.sample(answers_array, 10);
};

console.log(czar_cards());
console.log(player_cards());
