// index.js
const express = require('express');
const mapper1 = require('./commands/mapper1');

const port = 3000;
const app = express();
app.use(express.json());
app.use(express.text({ type: ['application/xml', 'text/xml'] }));

app.use('/portal', require('./router/portal'));
//app.use('/api/jobs', require('./router/jobs'));

// Ruta básica
app.get('/', async (req, res) => {
    const job = await mapper1.execute('order1.xml');
    const jobString = JSON.stringify(job, null, 2);
    res.send(jobString);
});

// Iniciar servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});