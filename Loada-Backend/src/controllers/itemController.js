const Item = require('../models/item');

const addItem = async (req, res) => {
    try {
        const { name, description, weight, dimensions, owner } = req.body;
        const item = new Item({ name, description, weight, dimensions, owner });
        await item.save();
        res.status(201).send({ message: 'Item added successfully' });
    } catch (err) {
        res.status(400).send({ message: err.message });
    }
};

module.exports = { addItem };