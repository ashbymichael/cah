;
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
    },
    onConnected: function(data) {
      console.log("hey: " + data.message);
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
      console.log("name: " + game.myName);
      console.log("game: " + game.gameID);
      $('#waiting-game-id').text(data.gameID);
    },
    onPlayerJoinedGame: function(data) {
      console.log(socket);
      console.log(data.playerName + ' joined. please wait.');
      game.loadPlayerWaitingDisplay();
      $("#waiting-players-count").text(data.numOfPlayer);

      // displays the list of player in the game
      var list = data.rooms[data.gameID].players ;
        $("#players-list").empty();
        for (var name in list) {
        $("#players-list").append("<li>" + list[name] + "</li>");
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
      if (game.myRole !== 'host') {
        $('#main-console').html($('#player-waiting-display').html());
        $('#waiting-game-id').html(game.gameID);
      }
    },
    loadHostDisplay: function(data) {
      $('#main-console').html($('#host-display').html());
      for (var player in data.players) {
        $('#player-order-list').append("<li>" + data.players[player] + "</li>");
      }
    },
    loadPlayerDisplay: function(data) { //data at this point is just room number
      $('#main-console').html($('#player-display').html());
      console.log(game.myPlayerCards);
      for (var card in game.myPlayerCards) {
        $("#cards-hand-ul").append("<li>" + game.myPlayerCards[card].text + "</li>");
      }
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

})(jQuery);
