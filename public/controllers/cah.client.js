;
(function($) {
  'use strict';

  var IO = {
    init: function() {
      IO.bindEvents();
    },
    bindEvents: function() {
      socket.on('connected', IO.onConnected);
      socket.on('newGameCreated', IO.onNewGameCreated);
      socket.on('playerJoinedGame', IO.onPlayerJoinedGame);
      socket.on('gameStarted', IO.onGameStarted);
    },
    onConnected: function(data) {
      console.log("hey: " + data.message);
      game.loadStartDisplay();
    },
    onNewGameCreated: function(data) {
      console.log(data);
      game.gameID = data.gameID;
      game.mySocketID = data.mySocketID;
      if (game.myName === '') {
        game.myName = "host";
      }

      game.loadHostWaitingDisplay();
      $('#waiting-game-id').text(data.gameID);
    },
    onPlayerJoinedGame: function(data) {
      console.log(socket);
      console.log(data.playerName + ' joined. please wait.');
      $("#waiting-players-count").text(data.numOfPlayer);

      // displays the list of player in the game
      var list = data.rooms[data.gameID].players ;
        $("#players-list").empty();
        for (var name in list) {
        $("#players-list").append("<li>" + list[name] + "</li>");
        }
    },
    onGameStarted: function(data) {
      if (game.myName === 'host') {
        game.loadHostDisplay(data);
      } else {
        game.loadPlayerDisplay(data);
      }
    }
  }

  IO.init();

  var game = {
    myName: '',
    myRole: '',
    gameID: '',
    myCzarCards: '',
    myPlayerCards: '',

    // Display loading functions
    loadStartDisplay: function() {
      $('#main-console').html($('#start-display').html());
      $('#create-game-button').click(function() {
        console.log('create game clicked')
        game.myRole = 'host';
        socket.emit('createNewGame');
      });
      $('#join-game-button').click(function() {
        console.log('join button clicked');
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
      $('#main-console').html($('#player-waiting-display').html());
      $('#waiting-game-id').html(game.gameID);
    },
    loadHostDisplay: function(data) {
      $('#main-console').html($('#host-display').html());
      for (var player in data.players) {
        $('#player-order-list').append("<li>" + data.players[player] + "</li>");
      }
    },
    loadPlayerDisplay: function(data) {
      $('#main-console').html($('#player-display').html());
      // $('#question-card-div').append("<li>" + #HOSTcard.text + "</li>")
      // for (var card in #something){
      //   $('#card-hand-div').append("<li>" + card.text + "</li>");
      // }
    }
  }

})(jQuery);
