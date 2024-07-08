const mongoose = require('mongoose');

const collectorSchema = new mongoose.Schema({
    name: String,
    phone: String,
    itemsPickedUp: {
        type: Number,
        default: 0
    },
    pickups: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pickup'
    }]
});

module.exports = mongoose.model('Collector', collectorSchema);
