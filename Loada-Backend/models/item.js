const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    name: { type: String, unique: true },
    description: String,
    quantity: { type: Number, default: 0 }
});

module.exports = mongoose.model('Item', itemSchema);
