const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../src/users/user.model');

const mongoUrl =
  process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017/lebaba_ecommerce';

const DEFAULT_USERNAME = process.env.DEFAULT_USER_USERNAME || 'theanh';
const DEFAULT_EMAIL = process.env.DEFAULT_USER_EMAIL || 'theanh@example.com';
const DEFAULT_PASSWORD = process.env.DEFAULT_USER_PASSWORD || '123456';

async function seedUser() {
  try {
    await mongoose.connect(mongoUrl);
    console.log('Connected to MongoDB, seeding default user...');

    let user = await User.findOne({ email: DEFAULT_EMAIL });

    if (user) {
      user.username = DEFAULT_USERNAME;
      user.password = DEFAULT_PASSWORD;
      await user.save();
      console.log('Updated existing user credentials.');
    } else {
      user = new User({
        username: DEFAULT_USERNAME,
        email: DEFAULT_EMAIL,
        password: DEFAULT_PASSWORD,
        role: 'user',
      });
      await user.save();
      console.log('Created default user successfully.');
    }
  } catch (error) {
    console.error('Error seeding default user:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
}

seedUser();



