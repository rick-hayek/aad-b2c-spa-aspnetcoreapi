const express = require("express");

const app = express();

const port = 3001;
const host = "http://localhost";

app.get("/", (request, response) => {
  response.writeHead(200, { "Content-Type": "text/html" });
  response.end("<h1>Hello express!</h>");
});

app.get("/api/user", (request, response) => {
  response.writeHead(200, { "Content-Type": "text/plain" });
  response.end(`<h1>Hello ${request.url}</h>`);
});

app.post("/api/user", (request, response) => {
  response.writeHead(200, { "Content-Type": "text/plain" });
  response.end(`<h1>Hello ${request.url} ${request.body}</h>`);
});

app.listen(port, () => {
  console.log(`listening on ${host}:${port}`);
});
