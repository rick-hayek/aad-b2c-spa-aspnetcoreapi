// Import node.js built-in http module
const http = require('http');
// Import node.js file system module
const fs = require('fs');
// Import path module
const path = require('path');

// Import express
const express = require('express');
// Build app
const app = express();

// Add middleware to handle '/'
app.get('/', (req, res) => {
  res.writeHead(200, {'Content-Type': 'text/html'});
  // Use node API fs.createReadStream to deal with file reading
  var stream = fs.createReadStream(__dirname + '/public/index.html', 'utf8')
  // pipe stream to response
  stream.pipe(res);
});

// Render a specific html file
app.get('/render', (req, res) => {
  // Use express API to response users' request
  // sendFile has the ability to set the Content-Type header based on file extension
  res.sendFile('public/index.html', {
    root: path.join(__dirname, '/')
  } );
});

// Add middleware to handle '/about'
app.get('/about', (req, res) => {
  res.end('This is ABOUT page! \n');
});

// Add middleware to handle all other requests
app.get('*', (req, res) => {
  res.writeHead(404, {'Content-Type': 'text/plain'});
  res.end('404 error! File not found. \n');
});

const hostname = '127.0.0.1';
const port = 3000;

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});