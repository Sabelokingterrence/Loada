<<<<<<< HEAD
// src/routes/index.js
const express = require('express');
const router = express.Router();

router.use('/users', require('./src/routes/userRoutes'));
router.use('/bookings', require('./src/routes/bookingRoutes'));
router.use('/Items', require('./src/routes/itemRoutes'));
router.use('/Collectors', require('./src/routes/collectorRoutes'));
router.use('/Pickups', require('./src/routes/pickupRoutes'));

module.exports = router;
=======
// src/routes/index.js
const express = require('express');
const router = express.Router();

router.use('/users', require('./src/routes/userRoutes'));
router.use('/bookings', require('./src/routes/bookingRoutes'));
router.use('/Items', require('./src/routes/itemRoutes'));
router.use('/Collectors', require('./src/routes/collectorRoutes'));
router.use('/Pickups', require('./src/routes/pickupRoutes'));

module.exports = router;
>>>>>>> a48951c7044dcced6f8342e8bd78cfd81b9819db
