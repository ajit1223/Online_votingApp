const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    const existingAdmin = await User.findOne({ username: 'admin' });
    if (existingAdmin) {
      console.log('⚠️ Admin already exists.');
      return mongoose.disconnect();
    }

    const hashedPassword = await bcrypt.hash('admin123', 10);

    const adminUser = new User({
      username: 'admin',
      password: hashedPassword,
      isAdmin: true,
    });

    await adminUser.save();
    console.log('✅ Admin user created successfully');
    mongoose.disconnect();
  })
  .catch(err => {
    console.error('❌ Error creating admin user:', err.message);
  });
