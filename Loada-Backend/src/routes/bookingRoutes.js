// src/routes/bookingRoutes.js
const express = require('express');
const { makeBooking, amendBooking, trackBooking } = require('../controllers/bookingController');
const router = express.Router();

router.post('/make', makeBooking);
router.put('/amend', amendBooking);
router.get('/track', trackBooking);

module.exports = router;
