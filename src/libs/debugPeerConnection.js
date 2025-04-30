
export function debugPeerConnection(pc, peerId = '') {
  const prefix = peerId ? `[Peer ${peerId}]` : '[Peer]';

  // Log ICE gathering state
  pc.onicegatheringstatechange = () => {
    console.log(`${prefix} 📶 ICE gathering state:`, pc.iceGatheringState);
  };

  // Log ICE connection state
  pc.oniceconnectionstatechange = () => {
    console.log(`${prefix} 🔁 ICE connection state:`, pc.iceConnectionState);
  };

  // Log overall connection state
  pc.onconnectionstatechange = () => {
    console.log(`${prefix} 🔗 Connection state:`, pc.connectionState);
  };

  // Log each ICE candidate
  pc.onicecandidate = (event) => {
    if (event.candidate) {
      const c = event.candidate.candidate;
      console.log(`${prefix} 🧊 ICE candidate:`, c);
      if (c.includes('relay')) {
        console.log(`${prefix} ✅ TURN relay candidate generado`);
      }
    } else {
      console.log(`${prefix} 🧊 ICE candidate gathering complete`);
    }
  };

  // Periodically log selected ICE candidate pair
  const interval = setInterval(async () => {
    const stats = await pc.getStats();
    stats.forEach(report => {
      if (report.type === 'candidate-pair' && report.state === 'succeeded') {
        const local = stats.get(report.localCandidateId);
        const remote = stats.get(report.remoteCandidateId);
        console.log(`${prefix} ✅ Selected candidate pair:`);
        console.log(`   Local:`, local);
        console.log(`   Remote:`, remote);
        clearInterval(interval);
      }
    });
  }, 1000);
}
