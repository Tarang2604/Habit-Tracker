const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const helmet = require('helmet');
const authRoutes = require('./routes/auth');
const habitRoutes = require('./routes/habits');
const notificationRoutes = require('./routes/notifications');
const { startCronJobs } = require('./utils/cronJobs');

dotenv.config();

const app = express();
app.use(helmet());
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/habits', habitRoutes);
app.use('/api/notifications', notificationRoutes);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/habit-tracker';

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    startCronJobs();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  });
