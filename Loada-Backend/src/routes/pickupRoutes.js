const express = require('express');
const { addPickup } = require('../controllers/pickupController');
const router = express.Router();

router.post('/pickup', addPickup);

module.exports = router;
