// Import node.js built-in http module
const http = require('http');

// Import express
const express = require('express');
// Build app
const app = express();

// Add middleware to handle '/'
app.use((req, res) => {
  if (req.url === '/') {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('This is HOME page! \n');
    return;
  }
  
  req.next();
});

// Add middleware to handle '/about'
app.use((req, res) => {
  if (req.url === '/about') {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('This is ABOUT page! \n');
    return;
  }
  
  req.next();
});

// Add middleware to handle all other requests
app.use((req, res) => {
  res.writeHead(404, { 'Content-Type': 'text/plain' })
  res.end('404 error! File not found. \n');
});

const hostname = '127.0.0.1';
const port = 3000;

http.createServer(app).listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
