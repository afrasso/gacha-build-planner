import express from "express";
import http from "http";
import next from "next";

// Create the Next.js app
const app = next({ dev: false });
const handle = app.getRequestHandler();

// Create an express app to handle API requests and use the Next.js app's request handler
const server = express();

server.all("*", (req, res) => {
  return handle(req, res); // Handle Next.js requests
});

// Start the server
app.prepare().then(() => {
  const httpServer = http.createServer(server);
  httpServer.listen(3000, () => {
    // if (err) throw err;
    console.log("> Ready on http://localhost:3000");
  });
});

export default server; // Export the server for testing
