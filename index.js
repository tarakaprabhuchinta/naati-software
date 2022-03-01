var http = require('http');
var fs = require('fs');
http.createServer(function (req, res) {
    if(req.url === '/' || req.url === '/login'){
    res.writeHead(200, {'Content-Type': 'text/html'});
    fs.createReadStream('login.html').pipe(res);
    }
    else if(req.url === '/register'){
    res.writeHead(200, {'Content-Type': 'text/html'});
    fs.createReadStream('registration.html').pipe(res);
    }
    else if(req.url === '/upload'){
        res.writeHead(200, {'Content-Type': 'text/html'});
        fs.createReadStream('upload.html').pipe(res);
        }
    else if(req.url === '/list'){
        res.writeHead(200, {'Content-Type': 'text/html'});
        fs.createReadStream('dialogues-list.html').pipe(res);
        }  
    else if(req.url === '/view'){
        res.writeHead(200, {'Content-Type': 'text/html'});
        fs.createReadStream('full-dialogue.html').pipe(res);
        }
    else{
        res.writeHead(404, {'Content-Type': 'text/html'});
        fs.createReadStream('404.html').pipe(res);
    }            
    console.log(req.url)
}).listen(8080);