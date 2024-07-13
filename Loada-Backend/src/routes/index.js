// src/routes/index.js
const express = require('express');
const router = express.Router();

router.use('/users', require('./userRoutes'));
router.use('/bookings', require('./bookingRoutes'));
router.use('/Items', require('./itemRoutes'));
router.use('/Collectors', require('./collectorRoutes'));
router.use('/Pickups', require('./pickupRoutes'));

module.exports = router;
