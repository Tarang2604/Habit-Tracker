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

const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter((key) => !process.env[key]);

if (missingEnvVars.length > 0) {
  console.error('Missing required environment variables:', missingEnvVars.join(', '));
  console.error('Set these in Render or your deployment environment before starting the server.');
  process.exit(1);
}

const app = express();
app.use(helmet());

const frontendUrl = process.env.FRONTEND_URL;
if (!frontendUrl) {
  console.warn('FRONTEND_URL is not set. CORS is configured to allow all origins.');
}

app.use(
  cors({
    origin: frontendUrl || true,
    credentials: true
  })
);
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/habits', habitRoutes);
app.use('/api/notifications', notificationRoutes);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

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
