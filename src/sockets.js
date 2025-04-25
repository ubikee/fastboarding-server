const { Server } = require('socket.io');

function setupSocket(server) {

    const io = new Server(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST']
        }
    });

    const rooms = {}; // { roomName: { providers: [], clients: [], connections: [] } }

    io.on('connection', socket => {

        console.log(`🔗 Conectando: ${socket.id}`);

        socket.on('monitor', () => {
            socket.join('__admin__');
            socket.emit('rooms-state', rooms); // estado inicial
        });

        socket.on('join', ({ room, role }) => {

            io.to('__admin__').emit('rooms-state', rooms);

            socket.join(room);

            if (role === 'provider') {
                console.log(`🛠 Proveedor se unió a ${room}`);
                socket.emit('joined', socket.id);

                // Almacena el ID del proveedor en la sala
                rooms[room] = rooms[room] || { providers: [], clients: [] };
                rooms[room].providers.push(socket.id);
            }

            if (role === 'client') {
                console.log(`👤 Cliente se unió a ${room}`);
                socket.emit('joined', socket.id);

                // Almacena el ID del cliente en la sala
                rooms[room] = rooms[room] || { providers: [], clients: [] };
                rooms[room].clients.push(socket.id);

                // Notifica al cliente si hay proveedores disponibles
                if (rooms[room].providers.length > 0) {
                    const providerId = rooms[room].providers[0];
                    socket.emit('peer-joined', providerId);
                } else {
                    socket.emit('no-provider');
                }
            }

            console.log(`👥 Proveedores en ${room}:`, rooms[room].providers)
            console.log(`👥 Clientes en ${room}:`, rooms[room].clients);
            socket.emit('joined', socket.id);
        });

        socket.on('signal', ({ to, from, payload }) => {

            console.log(`📡 Señal de ${from} a ${to}:`, payload);

            io.to(to).emit('signal', { from, payload });
        });

        socket.on('disconnect', () => {
            // Elimina si es proveedor
            for (const room in rooms) {
                const index = rooms[room].providers.indexOf(socket.id);
                if (index !== -1) {
                    rooms[room].providers.splice(index, 1);
                    console.log(`🔌 Proveedor ${socket.id} desconectado de ${room}`);
                }
            }
            // Elimina si es cliente
            for (const room in rooms) {
                const index = rooms[room].clients.indexOf(socket.id);
                if (index !== -1) {
                    rooms[room].clients.splice(index, 1);
                    console.log(`🔌 Cliente ${socket.id} desconectado de ${room}`);
                }
            }
        });
    });
}

module.exports = setupSocket;