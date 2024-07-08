const mongoose = require('mongoose');

const pickupSchema = new mongoose.Schema({
    collector: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Collector'
        },
        name: String,
        phone: String
    },
    item: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Item'
        },
        name: String,
        description: String
    },
    receiver: String,
    trackingNumber: String,
    deliveryDay: Date,
    collected: {
        type: Boolean,
        default: false
    },
    collectedAt: Date
});

module.exports = mongoose.model('Pickup', pickupSchema);
