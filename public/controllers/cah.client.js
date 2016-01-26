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
<<<<<<< HEAD
      // TODO: increase player count
      console.log("client:" + data)
      socket.emit('playerHasJoinedGame', data.playerName) 
=======
      console.log(data);
>>>>>>> f9e119d06af19d1a616a426b341522c974a9030c
      $("#waiting-players-count").text(data.numOfPlayer);
    },
    onGameStarted: function(data) {
      if (game.myName === 'host') {
        game.loadHostDisplay();
      } else {
        game.loadPlayerDisplay();
      }
    }
  }

  IO.init();

  var game = {
    myName: '',
    gameID: '',

    // Display loading functions
    loadStartDisplay: function() {
      $('#main-console').html($('#start-display').html());
      $('#create-game-button').click(function() {
        console.log('create game clicked')
        socket.emit('createNewGame');
      });
      $('#join-game-button').click(function() {
        console.log('join button clicked');
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
        socket.emit('playerWantsToJoinGame', { playerName: game.myName, gameID: game.gameID });
      })
    },
    loadPlayerWaitingDisplay: function() {
      $('#main-console').html($('#player-waiting-display').html());
      $('#waiting-game-id').html(game.gameID);
    },
    loadHostDisplay: function(data) {
      $('#main-console').html($('#host-display').html());
    },
    loadPlayerDisplay: function(data) {
      $('#main-console').html($('#player-display').html());
    }
  }

})(jQuery);
