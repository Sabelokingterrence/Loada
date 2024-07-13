const User = require('../models/user');

const registerUser = async (req, res) => {
    try {
        const { username, password, companyName, bankDetails, trucks, trackerLink } = req.body;
        const user = new User({ username, password, companyName, bankDetails, trucks, trackerLink });
        await user.save();
        res.status(201).send({ message: 'User registered successfully' });
    } catch (err) {
        res.status(400).send({ message: err.message });
    }
};

module.exports = { registerUser };
