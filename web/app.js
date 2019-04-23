// Import node.js built-in http module
const http = require("http");
// Import node.js file system module
const fs = require("fs");
// Import path module
const path = require("path");
// Import express
const express = require("express");

// Webpack
const webpack = require("webpack");
// Import webpack-dev-middleware
// webpack-dev-middleware is a middleware which can be mounted in an express server
// to serve the latest compilation of your bundle during development.
// This uses webpack's Node API in watch mode, and instead of outputting to the file system it outputs to memory.
// For production, you might want to use something like express.static instead of this middleware
const webpackMiddleware = require("webpack-dev-middleware");
const webpackConfig = require("./webpack.config");

// Import chokidar for reloading server and refreshing frontend page instantly
// once any file gets changed
const chokidar = require("chokidar");

const watcher = chokidar.watch(".", {
  ignored: ["./node_modules/**", "./build/**", "./.history.app.js/**"],
  ignoreInitial: true
});

watcher.on("all", (e, p) => {
  console.log(e, p);

  Object.keys(require.cache).forEach(id => {
    if (id.startsWith(path.join(__dirname, "src"))) {
      console.log(id);
      delete require.cache[id];
    }

    if (/[\/\\]app.js/.test(id)) {
      delete require.cache[id];
    }
  });
});

// Build express app
const app = express();

// Add webpack middleware
const webpackApp = webpack(webpackConfig);
app.use(webpackMiddleware(webpackApp));

// Render a specific html file
app.get("/render", (req, res) => {
  // Use express API to response users' request
  // sendFile has the ability to set the Content-Type header based on file extension
  res.sendFile("src/public/index.html", {
    root: path.join(__dirname, "/")
  });
});

// Add middleware to handle '/about'
app.get("/about", (req, res) => {
  res.end("This is ABOUT page! \n");
});

// Add middleware to handle all other requests
app.get("*", (req, res) => {
  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("404 error! File not found. \n");
});

const hostname = "127.0.0.1";
const port = 3000;

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
