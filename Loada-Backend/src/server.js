const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB Atlas');
}).catch(err => {
    console.error('Database connection error:', err);
});

// Import routes
const userRoutes = require('./routes/userRoutes');
const itemRoutes = require('./routes/itemRoutes');
const collectorRoutes = require('./routes/collectorRoutes');
const pickupRoutes = require('./routes/pickupRoutes');

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/collectors', collectorRoutes);
app.use('/api/pickups', pickupRoutes);

// Other routes...

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
