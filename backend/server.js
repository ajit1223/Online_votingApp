const express = require('express');
// Load .env variables
require('dotenv').config();
const mongoose = require('mongoose');
const cors = require('cors');
const adminRoutes = require('./routes/admin');

const authRoutes = require('./routes/auth');
const voteRoutes = require('./routes/vote');
// const adminRoutes = require('./routes/admin'); // we'll add this later

const app = express();


// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/vote', voteRoutes);
app.use('/api/admin', adminRoutes);
// app.use('/api/vote', require('./routes/vote'));



// MongoDB Connection
console.log('🔗 MONGO_URI:', process.env.MONGO_URI);
mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB error:', err));

// this is for connect mondoDB atlas
// mongoose.connect(process.env.MONGO_URI)
//   .then(() => console.log('✅ MongoDB connected'))
//   .catch(err => console.error('❌ MongoDB error:', err));


// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
