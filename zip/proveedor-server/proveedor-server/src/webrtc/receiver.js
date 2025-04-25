const { RTCPeerConnection } = require('wrtc');
const { writeChunk } = require('../utils/file-writer');
let fileBuffer = [];

function createReceiver(signalSocket) {
  const peer = new RTCPeerConnection();

  peer.ondatachannel = (event) => {
    const channel = event.channel;

    channel.onmessage = (e) => {
      const data = e.data;
      if (typeof data === 'string' && data === '__END__') {
        const file = Buffer.concat(fileBuffer);
        writeChunk('recibido.pdf', file);
        fileBuffer = [];
      } else {
        fileBuffer.push(Buffer.from(data));
      }
    };
  };

  signalSocket.on('message', async (data) => {
    const msg = JSON.parse(data);
    if (msg.type === 'offer') {
      await peer.setRemoteDescription(msg);
      const answer = await peer.createAnswer();
      await peer.setLocalDescription(answer);
      signalSocket.send(JSON.stringify(peer.localDescription));
    } else if (msg.candidate) {
      await peer.addIceCandidate(msg.candidate);
    }
  });
}

module.exports = { createReceiver };