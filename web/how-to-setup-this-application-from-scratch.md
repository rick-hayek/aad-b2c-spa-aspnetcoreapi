# Set up this single page application from scratch

This is gonna be long. I'm trying to explain details about how all those frontend related technologies and tools work under the hood, specifically, for node.js, express, webpack, and babel.

## Contents

- Setting up node web server
- Setting up express
- Setting up webpack
- Setting up babel

## Prerequisites

[node.js](https://nodejs.org/) is required to be installed.

## Environment

This demo application is running under (should work in an environment with higher versions):

- nodejs@v11.13.0
- npm@6.7.0
- express@4.16.4
- webpack@4.29.6

## Construct the folder hierarchy

Launch a terminal, and go to your working directory. Then issue following commands:

```bash
mkdir web
cd web
mkdir -p src
npm init -y
```

## Setting up node web server

[Node.js](https://nodejs.org/) is a JavaScript runtime built on Chrome's V8 JavaScript engine. We can host a web site on a node server. You may get more idea about node.js from this [thread](https://stackoverflow.com/questions/1884724/what-is-node-js) on stackoverlfow.

### Initializing node server

Create `app.js`:

```bash
touch app.js
```

Let's initialize the file by following [node.js start guide](https://nodejs.org/en/docs/guides/getting-started-guide/). Put below contents into `app.js` (app-v1.js):

```javascript
const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World\n');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
```

From terminal, issue command:

```bash
node app.js
```

And then open browser, navigate to <http://127.0.0.1:3000.> You can find that it returns `Hello World`, just as what we have defined in `app.js`.

### Starting server from package.json

Open up `package.json`, and modify the `scripts` section as below:

```json
"scripts": {
  "test": "echo \"Error: no test specified\" && exit 1",
  "start": "node app"
},
```

Now run command:

```bash
npm start
```

### Handling different requests

Let's update `app.js` as following (app-v2.js):

```javascript
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
  
  var output = '';
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
```

Run `npm start` from terminal. Then navigate to

- <http://127.0.0.1/>
- <http://127.0.0.1/about>
- <http://127.0.0.1/anythingelse>

We can browse these urls because we've used bunch of `if/else` to set up routes in `app.js`. This is ugly, and will be painful when web application gets complex.

## Setting up express

You should use [express](https://expressjs.com/). Here's [why](https://stackoverflow.com/a/17514674/5629917). And [this](http://evanhahn.com/understanding-express/) can help you understand express more.

Install express:

```bash
npm i express
```

### Bringing express in

Update `app.js` as:

```javascript
// Import node.js built-in http module
const http = require('http');

// Import express module
const express = require('express');
// Build app
const app = express();

// Use express to add middleware
app.use((req, res) => {
  if (req.url === '/') {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('This is HOME page! \n');
  }
  else if (req.url === '/about') {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('This is ABOUT page! \n');
  }
  else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 error! File not found. \n');
  }
});

const hostname = '127.0.0.1';
const port = 3000;

http.createServer(app).listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
```

Surely everything will work well. But still the ugly `if/else` is there. As we can see, express helps to add middleware to request pipeline. So why don't we just split every `if/else` into different middleware, and inject them all to request pipeline.

Let's update `app.js` as (app-v3.js):

```javascript
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
    return; // The later middleware won't be run as response ends here
  }
  
  // Continue to next middleware if request is not handled
  req.next();
});

// Add middleware to handle '/about'
app.use((req, res) => {
  if (req.url === '/about') {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('This is ABOUT page! \n'); 
    return; // The later middleware won't be run as response ends here
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
```

Run `npm start` to check if you get the expected results. We get some progress, though somehow is still ugly, but works.

### Introducing routing

Routing is an approach to map the requests to respective handler, just like the above `if` pathes. Express has this great feature which enables us getting rid of all those `if/else`.

Update `app.js` as following (app-v4.js):

```javascript
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
```

Now it's cleaner and more beautiful. It can be much more powerful, we will experience it later. Run `npm start` to test the results.

We use bunch of `app.get` to handle different requests. The express `get()` method maps to `HTTP GET` method. You can use `app.post`, `app.put`, etc. for other request methods.

Ok, it's time to host a real site on our node server.

## Hosting a static html page

a

## Setting up webpack

Why [webpack](https://webpack.js.org/concepts)? Here's a [great article](https://blog.andrewray.me/webpack-when-to-use-and-why/) talking about the ability that webpack has.

### Initial setup for webpack

```bash
npm i webpack webpack-cli --save-dev
```

Open up the [package.json](https://docs.npmjs.com/files/package.json), which is generated by `npm init`, and add `"build": "webpack"` to `"scripts"` section:

```json
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "node app",
    "build": "webpack"
  },
```

Now from terminal (in \web\\), run command:

```bash
npm run build
```

You will get errors that complain **"Entry module not found"**. The error should be something like:

```console
ERROR in Entry module not found: Error: Can't resolve './src' in 'C:\src\rickrepo\aad-b2c-spa-aspnetcoreapi\web'
npm ERR! code ELIFECYCLE
npm ERR! errno 2
npm ERR! web@1.0.0 build: `webpack`
npm ERR! Exit status 2
npm ERR!
npm ERR! Failed at the web@1.0.0 build script.
npm ERR! This is probably not a problem with npm. There is likely additional logging output above.
```

The error occurs because webpack is trying to find the entry point that is specified in configure file. Since we haven't create any configuration file, the default one will be "./src/index.js".

```text
Since version 4.0.0, webpack does not require a configuration file to bundle your project.
```

So let's create the index.js in ./src/:

```bash
cd src
touch index.js
```

And add the following contents to index.js:

```JavaScript
console.log("hello webpack!");
```

Now from terminal, go back to \web folder, run `npm run build` again:

```bash
cd ..
npm run build
```

Now it should run without any error. And you will be finding out that a new file `.\dist\main.js` is generated by webpack.

#### production & development mode

You will also notice that there's a WARNING message along with the build output:

```text
WARNING in configuration
The 'mode' option has not been set, webpack will fallback to 'production' for this value. Set 'mode' option to 'development' or 'production' to enable defaults for each environment.aults for each environment.
```

A production bundled output will be minified. Modify the `package.json` as following:

```json
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "node app",
    "dev": "webpack --mode development",
    "build": "webpack --mode production"
  },
```

Then compare the `.\dist\main.js` after running `npm run dev` and `npm run build`. You will find the differences.

### Using a configuration file for webpack

Using default values is fair enough for a startup or learning project, while you should use configuration files for large/complex/production web project.

Create a new file `webpack.config.js` (in \web\\):

```bash
touch webpack.config.js
```

and make initial values:

```javascript
module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "bundle.js"
  }
}
```

Now run `npm run build`, you will find `.\dist\bundle.js` (instead of the default main.js) is generated. This is where you can define all your customization and extend configurations. For now we can leave everything here. We will go back to this `webpack.config.js` soon.

For more advanced configurations, check this [document](https://webpack.js.org/configuration).

