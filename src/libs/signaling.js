const { Server } = require('socket.io');

const rooms = {}; // estructura: { roomName: { clients: [], providers: [], connections: [] } }

let io = null;

function createSocketServer(httpServer, { onUpdate } = {}) {
  io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  function broadcastRoomState(room) {
    io.to('__admin__').emit('rooms-state', rooms);
    if (onUpdate) onUpdate(room, rooms[room]);
  }

  io.on('connection', socket => {
    socket.on('join', ({ room, role }) => {
      socket.join(room);
      if (!rooms[room]) rooms[room] = { clients: [], providers: [], connections: [] };
      rooms[room][role + 's'].push(socket.id);

      if (role === 'client') {
        const providerId = rooms[room].providers[0];
        console.log('CLIENTE', socket.id, 'se unió a la sala', room, 'como', role);
        if (providerId) {
          rooms[room].connections.push({
            client: socket.id,
            provider: providerId,
            status: 'pending',
            progress: 0
          });
          console.log('CLIENTE', socket.id, 'enviando señal a PROVEEDOR', providerId);
          socket.emit('peer-joined', providerId);
          console.log('CLIENTE', socket.id, 'enviado señal a PROVEEDOR', providerId);
        } else {
          socket.emit('no-provider');
        }
      }

      socket.emit('joined', socket.id);
      broadcastRoomState(room);
    });

    socket.on('signal', ({ to, from, payload }) => {
      io.to(to).emit('signal', { from, payload });
      console.log('SIGNAL de', from, 'para', to, '- tipo:', payload?.type || 'candidate');
    });

    socket.on('update-connection', ({ room, client, status, progress }) => {
      const conn = rooms[room]?.connections?.find(c => c.client === client);
      if (conn) {
        conn.status = status;
        conn.progress = progress ?? conn.progress;
        broadcastRoomState(room);
      }
    });

    socket.on('monitor', () => {
      socket.join('__admin__');
      socket.emit('rooms-state', rooms);
    });

    socket.on('disconnect', () => {
      for (const room in rooms) {
        const r = rooms[room];
        for (const role of ['clients', 'providers']) {
          const idx = r[role].indexOf(socket.id);
          if (idx !== -1) r[role].splice(idx, 1);
        }
        r.connections = r.connections?.filter(
          c => c.client !== socket.id && c.provider !== socket.id
        );
        if (r.clients.length === 0 && r.providers.length === 0) delete rooms[room];
        else broadcastRoomState(room);
      }
    });
  });
}

function signalingMiddleware() {
  return (req, res, next) => {
    req.signaling = { io, rooms };
    next();
  };
}

module.exports = {
  server: () => signalingMiddleware(),
  setup: (httpServer, opts) => createSocketServer(httpServer, opts),
  rooms
};