// Import node.js built-in http module
const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  const body = 'Request URL: ' + req.url + '\n' +
    'Request Method: ' + req.method + '\n' +
    'Request Header: ' + JSON.stringify(req.headers) + '\n' +
    'Request localAddress: ' + req.socket.localAddress + '\n' +
    'Request localPort: ' + req.socket.localPort + '\n' +

    'Request remoteAddress: ' + req.socket.remoteAddress + '\n' +
    'Request remotePort: ' + req.socket.remotePort + '\n' +
    'Request remoteFamily: ' + req.socket.remoteFamily + '\n';
  
    if (req.url === '/') {
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end('This is HOME page! \n' + body);
    }
    else if (req.url === '/about') {
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end('This is ABOUT page! \n' + body);
    }
    else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 error! File not found.');
    }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});