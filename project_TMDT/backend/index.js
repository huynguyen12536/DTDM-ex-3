const express = require('express');
const app = express();
const cors = require('cors');
require("dotenv").config();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const uploadImage = require("./src/utils/uploadImage");

const mongoose = require('mongoose');
const port = process.env.PORT || 5000;

// Middleware setup
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ limit: "25mb" }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));  

app.use(cors({ 
  origin: 'http://localhost:5173',
  credentials: true,
}));



const authRoutes = require('./src/users/user.route');
const productRoutes = require('./src/products/products.route');
const orderRoutes = require('./src/orders/orders.route');
const reviewRoutes = require('./src/reviews/reviews.router');
const statsRoutes = require('./src/stats/stats.route');

// Routes setup

app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/stats', statsRoutes);


const User = require('./src/users/user.model');

async function createDefaultUser() {
  try {
    // Create admin user
    let admin = await User.findOne({ email: 'admin@gmail.com' });
    if (!admin) {
      admin = new User({
        username: 'admin',
        email: 'admin@gmail.com',
        password: '123456',
        role: 'admin',
      });
      await admin.save();
      console.log('✅ Admin user created: admin@gmail.com / 123456 (role: admin)');
    } else {
      admin.password = '123456';
      admin.role = 'admin';
      await admin.save();
      console.log('✅ Admin user updated: admin@gmail.com / 123456 (role: admin)');
    }

    // Create regular user
    let user = await User.findOne({ email: 'theanh@example.com' });
    if (!user) {
      user = new User({
        username: 'theanh',
        email: 'theanh@example.com',
        password: '123456',
        role: 'user',
      });
      await user.save();
      console.log('✅ Default user created: theanh@example.com / 123456');
    } else {
      user.password = '123456';
      await user.save();
      console.log('✅ Default user updated: theanh@example.com / 123456');
    }
  } catch (error) {
    console.error('⚠️ Could not create default users:', error.message);
  }
}

async function main() {
  const mongoUrl = process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017/lebaba_ecommerce';
  try {
    await mongoose.connect(mongoUrl);
    console.log('✅ Mongodb connected successfully!');
    
    // Create default user after connection
    await createDefaultUser();
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
  }
  
  app.get('/', (req, res) => {
    res.send('Lebaba Ecommerce Server is Running..!');
  });
}

main();



// upload image routes
app.post("/uploadImage", (req, res) => {
  uploadImage(req.body.image)
    .then((url) => res.send(url))
    .catch((err) => res.status(500).send(err));
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});