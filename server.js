var http = require('http'),
    fs = require('fs'),
    path = require('path'),
    request = require('request');
// CREATE SERVER //
http.createServer(function(request, response) {

    if (request.headers['content-type'] == 'application/json') {
        serveData(request, response);
    }
    else {
        serveStaticFile(request, response);
    }

}).listen(process.env.PORT, "0.0.0.0" || 8001);
console.log('server == :)');

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

// SERVICES //
var serveData = function(req, res) {
    console.log('data request: ' + req.url);

    if (req.url == '/nerd-list') {
        nerds.find({}).sort({
            name: 1
        }).toArray(function(err, items) {
            if (err) throw err;

            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end(JSON.stringify(items));
        });
    }
    if (req.url.indexOf('/api') >= 0) {
        var thisQuery = req.url.split('/').splice(-1,1).toString();
        if(thisQuery !== 'api'){
            request('http://pipes.yahoo.com/pipes/pipe.run?GameName=' + thisQuery + '&_id=10e437fdcc98acd69f96458995a8a1a2&_render=json', function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(body));
                }
            });    
        }
    }
};