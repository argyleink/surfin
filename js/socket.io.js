var socket = io.connect();

  socket.on('connect', function(){
    socket.emit('adduser', prompt("To join the game, gimme your name foo!"));
  });
  
  socket.on('updateusers', function(data) {
    $('#players').empty();
    $.each(data, function() {
      $('#players').append('<li player-id="'+ this.id +'">' + this.username + ': '+ this.score +'</li>'); 
    });
  });

  socket.on('scoreupdated', function (player) {
    $('[player-id="'+player.id+'"]').html(player.username + ": "+ player.score);
  });

  // on load of page
  $(function(){
    // when the client clicks SEND
    $('#datasend').click( function() {
      var message = $('#data').val();
      $('#data').val('');
      // tell server to execute 'sendchat' and send along one parameter
      socket.emit('sendchat', message);
    });
  });
  
  function foo() {
        socket.emit('playerScored','4528203231536492839');
    }