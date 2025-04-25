const WebSocket = require('ws');
const { createReceiver } = require('./webrtc/receiver');

const socket = new WebSocket('ws://localhost:8888');
socket.on('open', () => {
  console.log('Conectado al servidor de signaling');
  createReceiver(socket);
});