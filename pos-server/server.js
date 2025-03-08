// server.js

const http = require("http");
const WebSocket = require("ws");

const PORT = process.env.PORT || 7071;

// Create a basic HTTP server (optional)
const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("WebSocket server is running.\n");
});

// Create the WebSocket server, binding it to the HTTP server
const wss = new WebSocket.Server({ server });

// Broadcast function to send a message to all connected clients
const broadcast = (data, sender) => {
  wss.clients.forEach((client) => {
    if (client !== sender && client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
};

wss.on("connection", (ws) => {
  console.log("Client connected.");

  ws.on("message", (message) => {
    // Ensure the message is a string (in case it comes in as a Buffer)
    let data = message;
    if (Buffer.isBuffer(message)) {
      data = message.toString();
    }

    console.log("Received:", data);
    broadcast(data, ws);
  });

  ws.on("close", () => {
    console.log("Client disconnected.");
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`WebSocket server is listening on port ${PORT}`);
});
