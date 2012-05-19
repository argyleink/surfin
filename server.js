var http = require('http'),
    fs = require('fs'),
    path = require('path'),
    couchapp = require('couchapp');

// Database Connection //
//couchapp sync server.js https://argyleink.cloudant.com/surfin/;

// CREATE SERVER //
http.createServer(function(request, response) {

    if (request.headers['content-type'] == 'text/json') {
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

};