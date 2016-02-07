;
(function($) {
  'use strict';
  var IO,
      game,
      cookieName;

  IO = {
    init: function() {
      IO.bindEvents();
    },
    bindEvents: function() {
      socket.on('connected', IO.onConnected);
      socket.on('setReturn', IO.onSetReturn);
      socket.on('newGameCreated', IO.onNewGameCreated);
      socket.on('playerJoinedGame', IO.onPlayerJoinedGame);
      socket.on('cards', IO.onCards);
      socket.on('gameStarted', IO.onGameStarted);
    },
    onConnected: function(data) {
      console.log("hey: " + data.message);
      game.loadStartDisplay();

      // check for cookie.  if present, run onSetReturn (which will become setReturn if successful)
      cookieName = readCookie('name');
      if (cookieName) {
        console.log("cookie name: " + cookieName);
        game.myName = cookieName;
      };
      console.log("my name: " + game.myName);
    },
    onSetReturn: function(data) {
      // socket.emit("setReturn received by client");

      console.log(data);
      var cookieName = readCookie('name');
      console.log("My cookie name: " + cookieName);

      if (data && data.name === cookieName) {
        console.log("I heard setReturn");
      }
    },
    onNewGameCreated: function(data) {
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
    onCards: function(data){

      game.myPlayerCards = data;
      console.log(game.myPlayerCards);
    },
    onGameStarted: function(data) {
      if (game.myName === 'host') {
        game.loadHostDisplay(data);
      } else {
        game.loadPlayerDisplay(data);
      }
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
    }
  };

  function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
  };

})(jQuery);
