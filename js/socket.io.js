var socket = io.connect();

socket.on('connect', function(){
    socket.emit('adduser', prompt("What shall we call you?"));
});

socket.on('updateusers', function(data) {
    $('#players').empty();
    $.each(data, function() {
        $('#players').append('<li player-id="'+ this.id +'">' + this.username + ': '+ this.score +'</li>'); 
    });
});

socket.on('scoreupdated', function (player) {
    $('li[player-id="'+player.id+'"]').html(player.username + ": "+ player.score);
});

socket.on('imagesubmitted', function (player) {
    $('img[player-id="'+player.id+'"]').attr('src', player.image);
});

socket.on('imagesuccess', function (player) {
    console.log(player.username + ' uploaded an image successfully');
});

$(function(){
    $('#datasend').click( function() {
        var message = $('#data').val();
        $('#data').val('');
        // tell server to execute 'sendchat' and send along one parameter
        socket.emit('sendchat', message);
    });
});

function scored() {
    socket.emit('playerScored',socket.socket.sessionid);
}

function newGame() {
    socket.emit('newGame'); 
}