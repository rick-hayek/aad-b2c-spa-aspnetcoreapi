// Import node.js built-in http module
const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');

  const body = 'Request URL: ' + req.url + '\n' +
    'Request Method: ' + req.method + '\n' +
    'Request Header: ' + JSON.stringify(req.headers) + '\n' +
    'Request localAddress: ' + req.socket.localAddress + '\n' +
    'Request localPort: ' + req.socket.localPort + '\n' +

    'Request remoteAddress: ' + req.socket.remoteAddress + '\n' +
    'Request remotePort: ' + req.socket.remotePort + '\n' +
    'Request remoteFamily: ' + req.socket.remoteFamily + '\n';
  
  res.end(body);
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});