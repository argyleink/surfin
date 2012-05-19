var socket = io.connect();

socket.on('connect', function(){
    socket.emit('adduser', prompt("What shall we call you?"));
});

socket.on('updateusers', function(data) {
    $('#players').empty();
    $.each(data, function() {
        if(this.hotseat) 
            $('#players').append('<li hotseat player-id="'+ this.id +'">' + this.username + ': '+ this.score +'</li>');
        else 
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
    console.log(player);
    if($('#playerSubmits div[player-id="'+player.id+'"]').length <= 0){
        $('#playerSubmitsTmpl').tmpl(player).appendTo('#playerSubmits');
    }
});

socket.on('setword', function (word) {
    $('#game-word').html(word);
});

function scored() {
    socket.emit('playerScored',socket.socket.sessionid);
}

function newGame() {
    socket.emit('newGame'); 
}