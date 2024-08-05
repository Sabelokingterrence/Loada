const mongoose = require('mongoose');

// Define the container schema and model
const containerSchema = new mongoose.Schema({
  containerNumber: { type: String, required: true, unique: true },
  status: { type: String, required: true },
  date: { type: Date, default: Date.now },
  bookingDateTime: { type: Date }, // Make bookingDateTime optional
  truckNumberPlate: { type: String, required: true },
  loadingDock: { type: String, required: true }
});

const Container = mongoose.model('Container', containerSchema);

// Function to create a new container record
const createContainer = async (containerNumber, status, truckNumberPlate, loadingDock) => {
  try {
    const newContainer = new Container({
      containerNumber,
      status,
      truckNumberPlate,
      loadingDock
    });

    await newContainer.save();
    console.log('Container record created successfully');
  } catch (error) {
    console.error('Error creating container record:', error);
  }
};

// Function to make a booking
const makeBooking = async (containerNumber, bookingDate, bookingTime, truckNumberPlate) => {
  try {
    const bookingDateTime = new Date(`${bookingDate}T${bookingTime}`);
    const existingBooking = await Container.findOne({ bookingDateTime, truckNumberPlate });

    if (existingBooking) {
      console.log('Booking failed: A booking already exists for this date and time with the same truck.');
      return 'failed';
    }

    const container = await Container.findOne({ containerNumber });

    if (!container) {
      console.log('Booking failed: Container not found.');
      return 'failed';
    }

    container.bookingDateTime = bookingDateTime;
    container.status = 'Booked';

    await container.save();
    console.log('Booking successful');
    return 'success';
  } catch (error) {
    console.error('Error making booking:', error);
    return 'failed';
  }
};

// Function to search for a container by its number
const searchContainer = async (containerNumber) => {
  try {
    const container = await Container.findOne({ containerNumber });

    if (container) {
      console.log('Container found');
      return 'success';
    } else {
      console.log('Container not found');
      return 'failed';
    }
  } catch (error) {
    console.error('Error searching for container:', error);
    return 'failed';
  }
};

// Example usage
const exampleUsage = async () => {
  const uri = 'mongodb+srv://admin:admin@loada.wbbgq8q.mongodb.net/?retryWrites=true&w=majority&appName=loada';

  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log('Error connecting to MongoDB:', err));

  const containerNumber = 'C197456';
  const status = 'Pending';
  const truckNumberPlate = 'AB123CD';
  const loadingDock = 'Dock 5';

  await createContainer(containerNumber, status, truckNumberPlate, loadingDock);

  var bookingResult = await makeBooking(containerNumber, '2024-08-11', '10:00:00', truckNumberPlate);
  console.log('Booking result:', bookingResult);

  var searchResult = await searchContainer(containerNumber);
  console.log('Search result:', searchResult);

  mongoose.disconnect();
};

exampleUsage();
