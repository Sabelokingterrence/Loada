const express = require('express');
const { addItem } = require('../controllers/itemController');
const router = express.Router();

router.post('/item', addItem);

module.exports = router;
