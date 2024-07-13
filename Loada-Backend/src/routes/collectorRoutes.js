const express = require('express');
const { addCollector } = require('../controllers/collectorController');
const router = express.Router();

router.post('/collector', addCollector);

module.exports = router;
