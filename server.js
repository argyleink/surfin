var http = require('http'),
    fs = require('fs'),
    path = require('path'),
    game = {},
    players = [];

// CREATE SERVER //
var app = http.createServer(function(request, response) {

    serveStaticFile(request, response);

    }).listen(process.env.PORT, "0.0.0.0" || 8001);
    console.log('server == :)');
    
    var io = require('socket.io').listen(app);
    
    // FILE SERVER //
    var serveStaticFile = function(request, response) {
        var filePath = '.' + request.url;
        if (filePath == './') filePath = './index.html';


        var extname = path.extname(filePath);
        var contentType = 'text/html';
        switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        }

        console.log('serving ' + filePath + ", content type: " + contentType);

        path.exists(filePath, function(exists) {

            if (exists) {
                fs.readFile(filePath, function(error, content) {
                    if (error) {
                        response.writeHead(500);
                        response.end();
                    }
                    else {
                        response.writeHead(200, {
                            'Content-Type': contentType
                        });
                        response.end(content, 'utf-8');
                    }
                });
            }
            else {
                response.writeHead(404);
                response.end();
            }
        });
};

function newGame() {
    game.word = words[randomFromTo(0, words.length)];
    game.hotseat = "";
    players = []; 
}

io.sockets.on('connection', function (socket) {
    
    socket.on('newgame', newGame);
    io.sockets.emit('setword', game.word);
    
    socket.on('adduser', function(username){
        socket.username = username;
        socket.username.score = 0;
        
        var player = {};
        player.id = socket.id;
        player.username = username;
        player.score = 0;
        
        // first player gets hotseat
        if(players.length == 0) {
            game.hotseat = player.id;
            socket.emit('sethotseat', player.id);
            player.hotseat = true;
        }
        
        players.push(player);
        
        //socket.broadcast.emit('updatechat', 'SERVER', username + ' has connected');
        io.sockets.emit('updateusers', players);
    });
    
    socket.on('playerScored', function (playerid) {
        var player = findPlayer(playerid);
        player.score++;
        
        io.sockets.emit('scoreupdated', player);
    });
    
    socket.on('playerImage', function (playerid, src) {
        var player = findPlayer(playerid);
        player.image = src;
        
        io.sockets.emit('imagesubmitted', player);
        socket.emit('imagesuccess', player);
    });
    
});

function findPlayer(playerid) {
    for (var player in players) {
        if(players[player].id == playerid) {
            return players[player];
        }
    }   
}

var words = [
    "nasty",
    "raddical", 
    "suprising", 
    "scary", 
    "loud", 
    "quiet", 
    "peaceful", 
    "gnarly", 
    "broken", 
    "enraging", 
    "satisfying", 
    "electric", 
    "colorful", 
    "organized", 
    "loser", 
    "hero", 
    "dork", 
    "gangster", 
    "hipster", 
    "cupcake"
]

function randomFromTo(from, to){
    return Math.floor(Math.random() * (to - from + 1) + from);
}

newGame();