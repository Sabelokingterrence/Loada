const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { MessagingResponse } = require('twilio').twiml;
const rateLimit = require('express-rate-limit');
const cron = require('node-cron');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Twilio configuration
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

// MongoDB models
const Pickup = require('./models/pickup');
const Item = require('./models/item');
const Collector = require('./models/collector');
const User = require('./models/user');

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // Limit each IP to 100 requests per windowMs
});
app.use(limiter);

// JWT Middleware
const authenticateJWT = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer', '');
    if (!token) return res.status(403).send('A token is required for authentication');

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
    } catch (err) {
        return res.status(401).send('Invalid Token');
    }
    return next();
};

// Register User
app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = new User({ username, password });
        await user.save();
        res.status(201).send('User registered');
    } catch (err) {
        res.status(400).send(err.message);
    }
});

// Login User
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(400).send('Invalid credentials');
        }

        const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).send({ token });
    } catch (err) {
        res.status(400).send(err.message);
    }
});

// Add item
app.post('/add-item', authenticateJWT, async (req, res) => {
    const { name, description, quantity } = req.body;
    const item = new Item({ name, description, quantity });

    try {
        await item.save();
        res.status(201).send('Item added');
    } catch (err) {
        res.status(400).send(err.message);
    }
});

// Add collector
app.post('/add-collector', authenticateJWT, async (req, res) => {
    const { name, phone } = req.body;
    const collector = new Collector({ name, phone });

    try {
        await collector.save();
        res.status(201).send('Collector added');
    } catch (err) {
        res.status(400).send(err.message);
    }
});

// Add pickup
app.post('/add-pickup', authenticateJWT, async (req, res) => {
    const { collectorId, itemId, receiver, trackingNumber, deliveryDay } = req.body;

    try {
        const collector = await Collector.findById(collectorId);
        const item = await Item.findById(itemId);

        if (!collector) return res.status(404).send('Collector not found');
        if (!item) return res.status(404).send('Item not found');

        // Check if collector has reached the daily limit
        if (collector.itemsPickedUp >= 50) {
            return res.status(400).send('Collector has reached the daily limit of 50 items');
        }

        // Decrement item quantity
        if (item.quantity > 0) {
            item.quantity--;
            await item.save();
        } else {
            return res.status(400).send('Item out of stock');
        }

        // Increment itemsPickedUp count for collector
        collector.itemsPickedUp++;
        await collector.save();

        const pickup = new Pickup({
            collector: {
                id: collector._id,
                name: collector.name,
                phone: collector.phone
            },
            item: {
                id: item._id,
                name: item.name,
                description: item.description
            },
            receiver,
            trackingNumber,
            deliveryDay,
            collected: false,
            collectedAt: null
        });

        await pickup.save();

        // Add pickup reference to collector
        collector.pickups.push(pickup._id);
        await collector.save();

        res.status(201).send('Pickup added');
    } catch (err) {
        res.status(400).send(err.message);
    }
});


// Update pickup status
app.post('/update-pickup', authenticateJWT, async (req, res) => {
    const { trackingNumber, collectedAt } = req.body;

    try {
        const pickup = await Pickup.findOne({ trackingNumber });
        if (!pickup) return res.status(404).send('Pickup not found');

        pickup.collected = true;
        pickup.collectedAt = collectedAt;

        await pickup.save();

        // Send notifications to collector and receiver
        sendWhatsAppMessage(pickup.collector.phone, `Item collected at ${collectedAt}. Tracking number: ${trackingNumber}. Delivery day: ${pickup.deliveryDay}`);
        sendWhatsAppMessage(pickup.receiver.phone, `Your item has been collected at ${collectedAt}. Tracking number: ${trackingNumber}. Delivery day: ${pickup.deliveryDay}`);

        res.status(200).send('Pickup updated and notifications sent');
    } catch (err) {
        res.status(400).send(err.message);
    }
});

// Get collectors with item counts
app.get('/collectors', authenticateJWT, async (req, res) => {
    try {
        const collectors = await Collector.find().populate('pickups.item', 'name quantity');
        res.json(collectors);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

// Function to send WhatsApp message
function sendWhatsAppMessage(to, message) {
    client.messages.create({
        from: `whatsapp:${process.env.TWILIO_WHATSAPP_FROM}`,
        body: message,
        to: `whatsapp:${to}`
    }).then(message => console.log(`Message sent: ${message.sid}`)).catch(err => console.error(err));
}

// Schedule to reset collector limits at 12:00 AM every day
cron.schedule('0 0 * * *', async () => {
    try {
        await Collector.updateMany({}, { itemsPickedUp: 0 });
        console.log('Daily collector limits reset');
    } catch (err) {
        console.error('Error resetting collector limits:', err);
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
