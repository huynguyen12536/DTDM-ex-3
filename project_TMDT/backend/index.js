const express = require('express');
const app = express();
const cors = require('cors');
require("dotenv").config();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const getPresignedUrl = require("./src/utils/getPresignedUrl");
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
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));



const authRoutes = require('./src/users/user.route');
const productRoutes = require('./src/products/products.route');
const orderRoutes = require('./src/orders/orders.route');
const reviewRoutes = require('./src/reviews/reviews.router');
const statsRoutes = require('./src/stats/stats.route');

// Routes setup
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});
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



// presigned URL route for S3 upload (KHÔNG SỬ DỤNG - giữ để tham khảo)
// app.post("/api/get-presigned-url", getPresignedUrl);

// Base64 upload route - ĐANG SỬ DỤNG
app.post("/api/uploadImage", (req, res) => {
  console.log("📤 Received upload request");
  console.log("   Body keys:", Object.keys(req.body));
  console.log("   Image data length:", req.body.image ? req.body.image.length : 0);
  
  if (!req.body || !req.body.image) {
    console.error("❌ Missing image data in request");
    return res.status(400).json({ 
      error: "Missing image data", 
      message: "Please provide 'image' field in request body" 
    });
  }
  
  uploadImage(req.body.image)
    .then((url) => {
      console.log("✅ Upload successful:", url);
      return res.json(url);
    })
    .catch((err) => {
      console.error("❌ Upload failed:", err);
      console.error("   Error details:", err.message || err);
      return res.status(500).json({ 
        error: "Upload failed", 
        message: err.message || "Unknown error occurred" 
      });
    });
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});