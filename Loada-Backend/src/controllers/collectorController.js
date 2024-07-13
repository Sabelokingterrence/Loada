const Collector = require('../models/collector');

const addCollector = async (req, res) => {
    try {
        const { name, contactInfo, assignedItems } = req.body;
        const collector = new Collector({ name, contactInfo, assignedItems });
        await collector.save();
        res.status(201).send({ message: 'Collector added successfully' });
    } catch (err) {
        res.status(400).send({ message: err.message });
    }
};

module.exports = { addCollector };
