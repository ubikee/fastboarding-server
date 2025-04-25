const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8888 });

wss.on('connection', (ws) => {
  ws.on('message', (msg) => {
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(msg);
      }
    });
  });
});