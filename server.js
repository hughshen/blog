const http = require('http');
const fs = require('fs');
const path = require('path');
const staticDir = './static';

http.createServer((request, response) => {

    console.log('request ', request.url);

    let filePath = staticDir + request.url;
    if (filePath == staticDir + '/') filePath = staticDir + '/index.html';

    let extname = String(path.extname(filePath)).toLowerCase();
    let contentType = 'text/html';
    let mimeTypes = {
        '.html': 'text/html',
        '.xml': 'text/xml',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif',
        '.wav': 'audio/wav',
        '.mp4': 'video/mp4',
        '.woff': 'application/font-woff',
        '.ttf': 'application/font-ttf',
        '.eot': 'application/vnd.ms-fontobject',
        '.otf': 'application/font-otf',
        '.svg': 'application/image/svg+xml'
    };

    contentType = mimeTypes[extname] || 'application/octect-stream';

    if (!fs.existsSync(filePath)) {
        response.writeHead(404, {'Content-Type': contentType});
        response.end('Requested file not found.', 'utf-8');
    }

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if(error.code == 'ENOENT'){
                fs.readFile('./404.html', (error, content) => {
                    response.writeHead(200, {'Content-Type': contentType});
                    response.end(content, 'utf-8');
                });
            } else {
                response.writeHead(500);
                response.end('Sorry, check with the site admin for error: ' + error.code + ' ..\n');
                response.end();
            }
        } else {
            response.writeHead(200, {'Content-Type': contentType});
            response.end(content, 'utf-8');
        }
    });

}).listen(8080);

console.log('Server running at http://localhost:8080/');
