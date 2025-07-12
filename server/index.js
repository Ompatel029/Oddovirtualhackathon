const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes'); // ✅ Import the new user routes

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { 
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes); // ✅ Mount new user routes
 
// ✅ Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
 