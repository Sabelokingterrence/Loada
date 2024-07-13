const mongoose = require('mongoose');

const collectorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    contactInfo: {
        phone: { type: String, required: true },
        email: { type: String, required: true }
    },
    assignedItems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }]
});

module.exports = mongoose.model('Collector', collectorSchema);
