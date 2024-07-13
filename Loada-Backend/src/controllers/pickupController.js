const Pickup = require('../models/pickup');

const addPickup = async (req, res) => {
    try {
        const { collector, item, receiver, trackingNumber, deliveryDay } = req.body;
        const pickup = new Pickup({ collector, item, receiver, trackingNumber, deliveryDay });
        await pickup.save();
        res.status(201).send({ message: 'Pickup added successfully' });
    } catch (err) {
        res.status(400).send({ message: err.message });
    }
};

module.exports = { addPickup };
