# Set up this single page application from scratch

This is gonna be long. I'm trying to explain details about how all those frontend related technologies and tools work under the hood, specifically, for node.js, express, webpack, and babel.

## Contents

- [Setting up node web server](https://github.com/rick-hayek/aad-b2c-spa-aspnetcoreapi/blob/master/web/how-to-setup-this-application-from-scratch.md#setting-up-node-web-server)
- [Setting up express](https://github.com/rick-hayek/aad-b2c-spa-aspnetcoreapi/blob/master/web/how-to-setup-this-application-from-scratch.md#setting-up-express)
- [Setting up webpack](https://github.com/rick-hayek/aad-b2c-spa-aspnetcoreapi/blob/master/web/how-to-setup-this-application-from-scratch.md#setting-up-webpack)
- [Setting up babel](placeholder)

## Prerequisites

[node.js](https://nodejs.org/) needs to be installed.

### Environment

This demo application is running under (should work in an environment with higher versions):

- nodejs@v11.13.0
- npm@6.7.0
- express@4.16.4
- webpack@4.29.6

### Construct the folder hierarchy

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
const http = require("http");

const hostname = "127.0.0.1";
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  res.end("Hello World\n");
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
const http = require("http");

const hostname = "127.0.0.1";
const port = 3000;

const server = http.createServer((req, res) => {
  const body =
    "Request URL: " +
    req.url +
    "\n" +
    "Request Method: " +
    req.method +
    "\n" +
    "Request Header: " +
    JSON.stringify(req.headers) +
    "\n" +
    "Request localAddress: " +
    req.socket.localAddress +
    "\n" +
    "Request localPort: " +
    req.socket.localPort +
    "\n" +
    "Request remoteAddress: " +
    req.socket.remoteAddress +
    "\n" +
    "Request remotePort: " +
    req.socket.remotePort +
    "\n" +
    "Request remoteFamily: " +
    req.socket.remoteFamily +
    "\n";

  var output = "";
  if (req.url === "/") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("This is HOME page! \n" + body);
  } else if (req.url === "/about") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("This is ABOUT page! \n" + body);
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404 error! File not found.");
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
const http = require("http");

// Import express module
const express = require("express");
// Build app
const app = express();

// Use express to add middleware
app.use((req, res) => {
  if (req.url === "/") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("This is HOME page! \n");
  } else if (req.url === "/about") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("This is ABOUT page! \n");
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404 error! File not found. \n");
  }
});

const hostname = "127.0.0.1";
const port = 3000;

http.createServer(app).listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
```

Surely everything will work well. But still the ugly `if/else` is there. As we can see, express helps to add middleware to request pipeline. So why don't we just split every `if/else` into different middleware, and inject them all to request pipelines.

Let's update `app.js` as (app-v3.js):

```javascript
// Import node.js built-in http module
const http = require("http");

// Import express
const express = require("express");
// Build app
const app = express();

// Add middleware to handle '/'
app.use((req, res) => {
  if (req.url === "/") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("This is HOME page! \n");
    return; // The later middleware won't be run as response ends here
  }

  // Continue to next middleware if request is not handled
  req.next();
});

// Add middleware to handle '/about'
app.use((req, res) => {
  if (req.url === "/about") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("This is ABOUT page! \n");
    return; // The later middleware won't be run as response ends here
  }

  req.next();
});

// Add middleware to handle all other requests
app.use((req, res) => {
  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("404 error! File not found. \n");
});

const hostname = "127.0.0.1";
const port = 3000;

http.createServer(app).listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
```

Run `npm start` to check if you get the expected results. We get some progress, though somehow is still ugly, but works.

### Introducing routing

Routing is an approach to map the requests to respective handler, just like the above `if` paths. Express has this great feature which enables us getting rid of all those `if/else`.

Update `app.js` as following (app-v4.js):

```javascript
// Import node.js built-in http module
const http = require("http");

// Import express
const express = require("express");
// Build app
const app = express();

// Set response code
app.use((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  // Continue to next middleware as request is not completely handled
  req.next();
});

// Add middleware to handle '/'
app.get("/", (req, res) => {
  res.end("This is HOME page! \n");
});

// Add middleware to handle '/about'
app.get("/about", (req, res) => {
  res.end("This is ABOUT page! \n");
});

// Add middleware to handle all other requests
app.get("*", (req, res) => {
  res.end("404 error! File not found. \n");
});

const hostname = "127.0.0.1";
const port = 3000;

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
```

Now it's cleaner and more beautiful. It can be much more powerful, we will experience it later. Run `npm start` to test the results.

We use bunch of `app.get` to handle different requests. The express `get()` api maps to `HTTP GET` method. You can use `app.post`, `app.put`, etc. for other request methods.

Ok, it's time to host a real site on our node server.

## Hosting a static html page

We can start from hosting a static HTML file. Let's create a simple html file:

```bash
cd src
mkdir public
cd public
touch index.html
```

And initialize the `index.html` as following contents (or anything else as long as it's a valid HTML page):

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Home Page</title>
    <style>
      h1 {
        font: bold;
        color: burlywood;
        text-align: center;
      }

      p {
        color: blue;
        text-align: center;
      }
    </style>
  </head>
  <body>
    <h1>This is most awesome web site</h1>
    <p>You can never find a better one anywhere else</p>
    <div id="app"></div>
  </body>
</html>
```

Go back to `\web\` folder. Update `app.js` to (app-v5.js):

```javascript
// Import node.js built-in http module
const http = require("http");
// Import node.js file system module
const fs = require("fs");
// Import path module
const path = require("path");

// Import express
const express = require("express");
// Build app
const app = express();

// Add middleware to handle '/'
app.get("/", (req, res) => {
  res.writeHead(200, { "Content-Type": "text/html" });
  // Use node API fs.createReadStream to deal with file reading
  var stream = fs.createReadStream(
    path.join(__dirname, "/src/public/index.html"),
    "utf8"
  );
  stream.pipe(res);
});

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
```

You can observe that we are introducing two node modules:

```javascript
// Import node.js file system module
const fs = require("fs");
// Import path module
const path = require("path");
```

The [fs](https://nodejs.org/dist/latest-v11.x/docs/api/fs.html) module provides an API for interacting with the file system in a manner closely modeled around standard POSIX functions. To use this module:

```javascript
const fs = require("fs");
```

The [path](https://nodejs.org/dist/latest-v11.x/docs/api/path.html) module provides utilities for working with file and directory paths. It can be accessed using:

```javascript
const path = require("path");
```

Here I used two alternative methods to render a static file: node API `fs.createReadStream` and express API `res.sendFile`. In most situation, `res.sendFile`, which eventually calls the node `fs` APIs, is fair enough for dealing with such kind requests.

From terminal while in `\web` directory, run `npm start`. And then browse <http://127.0.0.1:3000/> and <http://127.0.0.1:3000/render>. See what you can find.

## Applying changes automatically

Now we are getting frontend involved, the code may changed a lot. You may have noticed whenever any configuration change is made, we need to restart node server to get things work. That will significantly slow down your development progress. We can make life better with some tools.

### Restarting node server automatically

We will use [nodemon](https://nodemon.io/) for server restarting.

```bash
npm i nodemon
```

Then update the `start` command from `package.json` as:

```json
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "nodemon app"
  },
```

Now run `npm start`, then modify you `app.js`, such as change any request handler. You will find the change is instantly applied without manually restart node server.

<!-- ### Refreshing browser page automatically

```bash
npm i chokidar
``` -->

## Setting up webpack

From above steps, we've figured out how node handles user requests, and also tried hosting static HTML files. For a modern web project, static files won't provide a good user experience. Usually the contents a web site serves are generated dynamically according to user actions.

_webpack bundles everything._ Why [webpack](https://webpack.js.org/concepts)? Here's a [great article](https://blog.andrewray.me/webpack-when-to-use-and-why/) talking about the ability that webpack has.

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

Now from terminal (in `\web\`), run command:

```bash
npm run build
```

You will get errors that complain **"Entry module not found"**. The error should be something like:

```console
ERROR in Entry module not found: Error: Can't resolve './src' in '<your-working-directory>\web'
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

Now from terminal, go back to `\web\` folder, run `npm run build` again:

```bash
cd ..
npm run build
```

Now it should run without any error. And you will be finding out that a new file `.\dist\main.js` is generated by webpack.

#### production & development mode

You will also notice that there's a WARNING message along with the build output:

```text
WARNING in configuration
The 'mode' option has not been set, webpack will fallback to 'production' for this value. Set 'mode' option to 'development' or 'production' to enable defaults for each environment.
You can also set it to 'none' to disable any default behavior. Learn more: https://webpack.js.org/concepts/mode/
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

Create a new file `webpack.config.js` (in `\web\`):

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
};
```

Now run `npm run build`, you will find `.\dist\bundle.js` (instead of the default `main.js`) is generated. This is where you can define all your customization and extend configurations.

For more advanced configurations, check this [document](https://webpack.js.org/configuration).

### Using different configurations for different environments

Usually you may want to use different configurations for production and development environments. Create a new fie:

```bash
touch webpack.prod.config.js
```

Initialize it with contents:

```javascript
const path = require("path");

module.exports = {
  mode: "production",
  entry: "./src/index.js",
  output: {
    filename: "bundle.[contenthash:16].js",
    path: path.join(__dirname, "dist")
  }
};
```

And then update the scripts from `package.json`:

```json
 "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "node app",
    "dev": "webpack --mode development",
    "build": "webpack --config webpack.prod.config.js"
  },
```

### Using development tool

It's kind of insane that you have to manually run `npm run build` whenever you change any code and want to compile your code. Webpack comes with several [development tools](https://webpack.js.org/guides/development#choosing-a-development-tool) that help automatically compile any changes and hopefully refresh the web page. Here we will use `webpack-dev-server`:

```bash
npm i webpack-dev-server --save-dev
```

And then update `webpack.config.js` as:

```javascript
module.exports = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    filename: "bundle.js"
  },
  devServer: {
    contentBase: "./dist",
    port: 3000
  }
};
```

For more configurations about `webpack-dev-server`, check [here](https://webpack.js.org/configuration/dev-server).

Now update the `scripts` section in `package.json` as:

```json
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "webpack && webpack-dev-server --open",
    "dev": "webpack",
    "build": "webpack --config webpack.prod.config.js"
  },
```

I update the `dev` command from `webpack --mode development` to `webpack`, 'cause I've added the `mode` parameter in `webpack.config.js`.

From terminal, run `npm start`. It will build your code and launch the webpack dev server.

### Processing HTML

webpack needs additional components to deal with HTML files: [html-webpack-plugin](https://webpack.js.org/plugins/html-webpack-plugin) and [html-loader](https://webpack.js.org/loaders/html-loader).

> A [loader](https://webpack.js.org/concepts/loaders/) does preprocessing transformation of files with a specified file format **before** the bundle is generated. For example, a [ts-loader](https://github.com/TypeStrong/ts-loader) transforms Type-Script to JavaScript.
>
> A [plugin](https://webpack.js.org/concepts/plugins) will do everything that a loader cannot do. It works at bundle or chunk level, and usually work at the end of the bundle generation process.

```bash
npm i html-webpack-plugin html-loader --save-dev
```

Then update the `webpack.config.js`:

```javascript
const path = require("path");
const HtmlWebPackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development", // production
  entry: "./src/index.js",
  output: {
    filename: "bundle.js",
    path: path.join(__dirname, "dist") // dist is the default folder name while you can change it to any other name
  },
  devServer: {
    contentBase: "./dist",
    port: 3000
  },
  module: {
    rules: [
      {
        test: /\.(html)$/,
        use: [{ loader: "html-loader" }]
      }
    ]
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: "./src/public/index.html",
      filename: "./index.html" // relative path to the PATH from OUTPUT
    })
  ]
};
```

I add a new property `module` where you can configure rules for handling different files. And I also add a plugin where I specify the HTML template file and the output HTML file. If not providing any parameter for HtmlWebPackPlugin, using like:

```javascript
...
plugins: [
    new HtmlWebPackPlugin()
  ]
```

then the resulting HTML will be a default one, something like this:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Webpack App</title>
  </head>
  <body>
    <script type="text/javascript" src="bundle.js"></script>
  </body>
</html>
```

Run `npm run build`, and check the resulting HTML file `./dist/index.html`. You can observe that the bundle output file `bundle.js` has been injected (through `<script>`).

### Processing CSS

Create folder:

```bash
cd src
mkdir style
touch main.css
```

Initial `main.css` as:

```css
h1 {
  font: bold;
  color: burlywood;
  text-align: center;
}

p {
  color: blue;
  text-align: center;
}
```

These styles actually are copied from the `\public\index.html`, so we now can remove those inline styles. Update `\public\index.html` as:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Home Page</title>
  </head>
  <body>
    <h1>This is the most awesome web site</h1>
    <p>You can never find a better one anywhere else</p>
    <div id="app"></div>
  </body>
</html>
```

#### css-loader

The [css-loader](https://webpack.js.org/loaders/css-loader) interprets `@import` and `url()`. It reads contents of css file as a string to a JavaScript variable.

```bash
npm i css-loader --save-dev
```

For example, you want to import css in a javascript file:

```javascript
import style from "./style/myStyle.css";
const anotherStyle = require("./style/anotherStyle.css");
```

Then you will get build error if you don't use `css-loader`. You can update code to:

```javascript
import style from "css-loader!./style/myStyle.css";
const anotherStyle = require("css-loader!./style/anotherStyle.css");
```

You surely can get style things worked with above approach, while usually you should configure it in `webpack.config.js`. Then it will apply globally, instead of specifying `css-loader` everywhere. To configure `css-loader`, just add another rule to `webpack.config.js`:

```JavaScript
  module: {
    rules: [
      {
        test: /\.(html)$/,
        use: [ { loader: "html-loader" } ]
      },
      {
        test: /\.(css)$/,
        use: [
          { loader: "css-loader"}
        ]
      }
    ]
  },
```

Then you can update the `./src/index.js` as:

```javascript
import css from "./style/main.css";

console.log("hello webpack!");
console.log(css);
```

Run `npm start`, and check the `bundle.js`. You can find the stylesheet content is added into the script. You may also observe that the page hasn't apply any styles from `main.css`. This will be resolved by `style-loader`.

Note, you have to import or reference the stylesheet file directly or indirectly by the entry file, which is `./src/index.js` here.

#### style-loader

The [style-loader](https://webpack.js.org/loaders/style-loader) reads the style contents, and injects them into the page's `<head>` element by creating a `<style>` tag (at runtime, not compile/build time).

```bash
npm i style-loader --save-dev
```

Then add rule in `webpack.config.js`:

```JavaScript
  module: {
    rules: [
      {
        test: /\.(html)$/,
        use: [ { loader: "html-loader" } ]
      },
      {
        test: /\.(css)$/,
        use: [
          { loader: "style-loader" },
          { loader: "css-loader"}
        ]
      }
    ]
  },
```

Run `npm start`, you will find the styles are applied on the page.

#### sass-loader

To support **scss**, add `sass-loader` and `node-sass`:

```bash
npm i sass-loader node-sass --save-dev
```

Add sass-loader into the existing style configuration block in `webpack.config.js`:

```javascript
  {
    test: [/.css$|.scss$/],
    use: [
      "style-loader",
      'css-loader',
      'sass-loader'
    ]
  }
```

#### Extracting css into a separated file

Instead of injecting the stylesheet as inline, usually we should reference the stylesheet from an external file from `<link>` tag. [mini-css-extract-plugin](https://webpack.js.org/plugins/mini-css-extract-plugin) provides this alternative.

```bash
npm install --save-dev mini-css-extract-plugin
```

Then update `webpack.config.js` as:

```javascript
...
// css-mini-extract-plugin extracts styles to an external stylesheet file,
// and injects it into HTML file by creating a <link> tag in <head> element
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  ...
  module: {
    rules: [
      ...
      {
        test: /\.(css)$/,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          { loader: "css-loader"},
        ]
      }
    ]
  },
  plugins: [
    ...
    new MiniCssExtractPlugin({
      filename: 'app.[contenthash:8].css', // resulting stylesheet file
    }),
  ],
  ...
};
```

Run `npm start`. There will be a separate file `app.[hash:8].css` being generated in the `dist` folder. And from the `./dist/index.html`, this css file is referenced from `<link>` tag in `<head>` element.

Browse <http://localhost:3000/>, the styles are applied on index page.

### Processing images

The [file-loader](https://webpack.js.org/loaders/file-loader) resolves `import/require()` on a file into a url and emits the file into the output directory:

```bash
npm install file-loader --save-dev
```

Update `webpack.config.js` to add rule for image files:

```javascript
{
  test: /\.(png|jpg|gif|svg)$/,
  use: [
    {
      loader: 'file-loader',
      options: {
        name: '[name].[hash:8].[ext]',
        outputPath: 'assets/'
      }
    }
  ]
}
```

Then you can import image from a js file like this:

```javascript
import logo from "path/to/image/logo.png";
```

Let's try it.

```bash
cd src
mkdir image
```

Find an image file, and save it in `./src/image` folder. Then include it from entry point `./src/index.js`:

Update `index.js` as:

```javascript
import css from "./style/main.css";
import background from "./image/beach-exotic-holiday.jpg";

var print = msg => {
  console.log(msg);
};

print("hello webpack!");

console.log(background);
var img = document.createElement("img");
img.src = background;

var container = document.getElementById("app");
container.appendChild(img);
```

Build and run the application to check if image works.

## Bring things together: express + webpack

From above tutorial, we've leaned how to serve a web application with express server, and using webpack as development server for bundle application. Now let's connect these two: Use express server to serve a bundled application.

```bash
npm i webpack-dev-middleware --save-dev
```

Update `app.js`:

```javascript
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
const webpackMiddleware = require("webpack-dev-middleware");
const webpackConfig = require("./webpack.config");

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
```

and update the commands from `package.json`:

```json
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "nodemon app.js",
    "webpack": "webpack && webpack-dev-server --open",
    "dev": "rm -rf ./build/ && webpack",
    "build": "rm -rf ./build/ && webpack --config webpack.prod.config.js"
  },
```

Run `npm start`. Now our web application can serve both the bundled application and any other routes, like `/about` from `app.get("about", ...)`.

## References

- [Setting up webpack for a project](https://auralinna.blog/post/2018/setting-up-webpack-4-for-a-project)
- [webpack tutorial](https://www.valentinog.com/blog/webpack-tutorial/)
- [Setting up webpack for any project](https://scotch.io/tutorials/setting-up-webpack-for-any-project)
- [Setting up a minimal Node environment with Webpack and Babel](https://dev.to/aurelkurtula/setting-up-a-minimal-node-environment-with-webpack-and-babel--1j04)
