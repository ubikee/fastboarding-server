const express = require('express');
const path = require('path');

const router = express.Router();

const staticPath = path.join(__dirname, '..', '..', 'static', 'portal-build');
router.use('/', express.static(staticPath));

router.get(/^\/(?!static\/).*$/, (req, res) => {
    res.sendFile(path.join(staticPath, 'index.html'));
  });
  
module.exports = router;