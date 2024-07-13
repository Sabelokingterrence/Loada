// src/models/Booking.js
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    containerNumber: String,
    referenceNumber: String,
    timeSlot: Date,
    tower: String,
    truckNumber: String,
    status: String,
});

module.exports = mongoose.model('Booking', bookingSchema);
