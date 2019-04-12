// Import node.js built-in http module
const http = require('http');

// Import express
const express = require('express');
// Build app
const app = express();

// Set response code
app.use((req, res) => {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    // Continue to next middleware as request is not completely handled
    req.next();
});

// Add middleware to handle '/'
app.get('/', (req, res) => {
  res.end('This is HOME page! \n');
});

// Add middleware to handle '/about'
app.get('/about', (req, res) => {
  res.end('This is ABOUT page! \n');
});

// Add middleware to handle all other requests
app.get('*', (req, res) => {
  res.end('404 error! File not found. \n');
});

const hostname = '127.0.0.1';
const port = 3000;

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});