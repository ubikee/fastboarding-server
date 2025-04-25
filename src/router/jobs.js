const express = require('express');
const fs = require('fs');
const path = require('path');
const { processOrderXml } = require('../parser/xmlToJob');
const MappingsRepository = require('../domain/mappings/MappingsRepository');

const router = express.Router();

router.post('/jobs', async (req, res) => {
    const { clientId } = req.query;
    const xml = req.body;

    if (!clientId) return res.status(400).json({ error: 'Missing clientId query param' });
    if (!xml || typeof xml !== 'string') return res.status(400).json({ error: 'Missing XML body' });

    try {
        const mappingDoc = await MappingsRepository.findByClientId(clientId);
        if (!mappingDoc) return res.status(404).json({ error: `No mapping found for client '${clientId}'` });

        const job = await processOrderXml(xml, mappingDoc.mapping);
        res.status(201).json({ ...job, source: { clientId } });
    } catch (err) {
        console.error('Failed to process job:', err);
        res.status(500).json({ error: 'Internal error' });
    }
});

module.exports = router;