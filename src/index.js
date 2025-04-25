// Express
const express = require('express');
const app = express();
app.use(express.json());
app.use('/portal', require('./router/portal'));

// HTTP
const http = require('http');
const httpServer = http.createServer(app);

// Signaling
const signaling = require('./libs/signaling');
signaling.setup(httpServer)
app.use(signaling.server());

// Run Server
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
    console.log('✅ Servidor escuchando en :3000');
});