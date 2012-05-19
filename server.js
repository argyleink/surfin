var http = require('http'),
    fs = require('fs'),
    path = require('path');

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

var players = [];
io.sockets.on('connection', function (socket) {
    
    socket.on('adduser', function(username){
        socket.username = username;
        socket.username.score = 0;
        
        var player = {};
        player.id = socket.id;
        player.username = username;
        player.score = 0;
        players.push(player);
        
        socket.emit('updatechat', 'SERVER', 'you have connected');
        socket.broadcast.emit('updatechat', 'SERVER', username + ' has connected');
        io.sockets.emit('updateusers', players);
    });
    
    socket.on('playerScored', function (playerid) {
        var match;
        for (var player in players) {
            if(players[player].id == playerid) {
                players[player].score++;  
                match = players[player];
            }
        }
        io.sockets.emit('scoreupdated', match);
    });
    
});