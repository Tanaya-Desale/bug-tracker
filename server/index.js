// server/index.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const projectRoutes = require('./routes/projectRoutes');
app.use('/api/projects', projectRoutes);

const ticketRoutes = require('./routes/ticketRoutes');
app.use('/api/tickets', ticketRoutes);

// Default route for testing
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Environment variables
const PORT = process.env.PORT || 10000; // Use Render-assigned port
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ MONGO_URI is missing from .env file");
  process.exit(1);
}

// MongoDB Connection
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ MongoDB Connected');
  app.listen(PORT, '0.0.0.0', () => {  // 👈 Bind to all interfaces (important for Render)
    console.log(`🚀 Server running on port ${PORT}`);
  });
})
.catch((err) => {
  console.error('❌ DB connection failed:', err.message);
});