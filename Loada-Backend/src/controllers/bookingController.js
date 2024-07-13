// src/controllers/bookingController.js
const Booking = require('../models/Booking');

exports.makeBooking = async (req, res) => {
    try {
        const { userId, containerNumber, referenceNumber, timeSlot, tower, truckNumber, status } = req.body;
        const booking = new Booking({ userId, containerNumber, referenceNumber, timeSlot, tower, truckNumber, status });
        await booking.save();
        res.status(201).json(booking);
    } catch (error) {
        res.status(500).json({ message: 'Error making booking', error });
    }
};

exports.amendBooking = async (req, res) => {
    try {
        const { bookingId, truckNumber } = req.body;
        const booking = await Booking.findByIdAndUpdate(bookingId, { truckNumber }, { new: true });
        res.status(200).json(booking);
    } catch (error) {
        res.status(500).json({ message: 'Error amending booking', error });
    }
};

exports.trackBooking = async (req, res) => {
    try {
        const { containerNumber } = req.query;
        const booking = await Booking.findOne({ containerNumber });
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        res.status(200).json(booking);
    } catch (error) {
        res.status(500).json({ message: 'Error tracking booking', error });
    }
};
