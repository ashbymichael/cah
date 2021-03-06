/*
This file is tided to Socket.io lifecycle called from the index.js flie ....???
loads the client view...
*/

(function($) {
  'use strict';
  var IO,
      game;

  IO = {
    init: function() {
      IO.bindEvents();
    },
    bindEvents: function() {
      socket.on('connected', IO.onConnected);
      socket.on('newGameCreated', IO.onNewGameCreated);
      socket.on('playerJoinedGame', IO.onPlayerJoinedGame);
      socket.on('cards', IO.onCards);
      socket.on('gameStarted', IO.onGameStarted);
      socket.on('gameIDNotValid', IO.onGameIDNotValid);
      socket.on('reloadCzar', IO.onReloadCzar);
    },
    onConnected: function(data) {
      game.loadStartDisplay();

      // check for cookie.  if present, run setReturn
      if (readCookie('name')) IO.setReturn();
      if (game.myName) console.log("my name: " + game.myName);
      if (game.gameID) console.log("my game: " + game.gameID);
    },
    setReturn: function() {
      game.myName = readCookie('name');
      game.gameID = readCookie('game');
      // Check for previous game.  If present, rejoin.
      socket.emit('playerWantsToJoinGame',
                  { playerName: game.myName, gameID: game.gameID });
    },
    onNewGameCreated: function(data) {
      game.gameID = data.gameID;
      game.mySocketID = data.mySocketID;

      game.loadHostWaitingDisplay();
      $('#waiting-game-id').text(data.gameID);
    },
    onPlayerJoinedGame: function(data) {
      game.loadPlayerWaitingDisplay();
      $("#waiting-players-count").text(data.numOfPlayer);

      // displays the list of player in the game
      var list = data.rooms[data.gameID].players ;
        $("#players-list").empty();
        for (var name in list) {
        $("#players-list").append("<li>" + list[name].player_name + "</li>");
      }
    },
    onCards: function(data){
      if (game.myPlayerCards.length === 0){
      game.myPlayerCards = data;
    } else {
      game.myPlayerCards = [];
      game.myPlayerCards = data;
    }

    },
    onGameStarted: function(data) {
      console.log(data);
      if (data.current_czar.player_name === game.myName){
        game.myRole = 'czar';
      }
      if (game.myRole === 'host') {
        game.loadHostDisplay(data);
      } else if(game.myRole === 'czar'){
        game.loadCardCzarDisplay(data);
      } else {
        game.loadPlayerDisplay(data);
      }
    },
    onGameIDNotValid: function(data) {
      if (game.gameID === data.gameID) {
        console.log("Game ID not valid");
        deleteCookie(name);
        deleteCookie(game);
        console.log("cookies deleted");
      }
    },
    onReloadCzar: function(data){
      console.log("made it to reload");
      game.loadCardCzarDisplay(data);
    }
  };

  IO.init();

  game = {
    myName: '',
    myRole: '',
    gameID: '',
    myCzarCards: '',
    myPlayerCards: '',

    // Display loading functions
    loadStartDisplay: function() {
      $('#main-console').html($('#start-display').html());
      $('#create-game-button').click(function() {
        game.myRole = 'host';
        socket.emit('createNewGame');
      });
      $('#join-game-button').click(function() {
        game.myRole = 'player';
        game.loadJoinDisplay();
      });
    },
    loadHostWaitingDisplay: function() {
      $('#main-console').html($('#host-waiting-display').html());
      $('#begin-play-button').click(function() {
        socket.emit('startGame', { room: game.gameID } );
      });
    },
    loadJoinDisplay: function() {
      $('#main-console').html($('#join-display').html());
      $('#join-form').submit(function(e) {
        e.preventDefault();
        game.myName = $("#name-input").val();
        game.gameID = $("#game-input").val();
        game.loadPlayerWaitingDisplay();
        socket.emit('playerWantsToJoinGame',
                    { playerName: game.myName, gameID: game.gameID });
      })
    },
    loadPlayerWaitingDisplay: function() {
      if (game.myRole !== 'host') {
        $('#main-console').html($('#player-waiting-display').html());
        $('#waiting-game-id').html(game.gameID);
      }
    },
    loadHostDisplay: function(data) {
      $('#main-console').html($('#host-display').html());
      $('#question-card-div').append("<p class='question'>" + data.question_card.text + "</p>")
      for (var player in data.players) {
        $('#player-order-list').append("<li>" + data.players[player].player_name + "</li>");
      }
    },
    loadCardCzarDisplay: function(data){
      $('#main-console').html($('#czar-display').html());
      $('#question-card-div').append("<p class='question'>" + data.question_card.text + "</p>")
      console.log("length is: " + data.players.length);
      console.log("player_cards is: " + data.playeed_cards.length);
      if(data.played_cards.length != (data.players.length - 2)){
        $('#pick-button').prop("disabled", "true");
      } else {
        $('#pick-button').prop("disabled", "false");
      }
    },
    loadPlayerDisplay: function(data) { //data
      $('#main-console').html($('#player-display').html());
      for (var card in game.myPlayerCards) {
        $("#cards-hand-ul").append("<li class='card-list'><button class='card-button' id='" + card + "''>" + game.myPlayerCards[card].text + "</button></li>");
      };
      $('.card-button').click(function(){
        // need get the index of nth child
        var id = $('.card-button').attr('id')
        data.played_cards.push(game.myPlayerCards[id]);
        socket.emit('playedCard', data);
      $('.card-button').prop("disabled", "true");
      });
    }
  };

  function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) {
          return c.substring(nameEQ.length,c.length);
        }
    }
    return null;
  };

  function deleteCookie(name) {
    document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  }

})(jQuery);
