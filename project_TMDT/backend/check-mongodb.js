// Script để kiểm tra kết nối MongoDB và xem dữ liệu
const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./src/users/user.model');
const Order = require('./src/orders/orders.model');
const Product = require('./src/products/products.model');

const mongoUrl = process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017/lebaba_ecommerce';

async function checkMongoDB() {
  try {
    console.log('🔍 Đang kết nối đến MongoDB...');
    console.log('📍 URL:', mongoUrl);
    
    await mongoose.connect(mongoUrl);
    console.log('✅ Kết nối MongoDB thành công!\n');

    // Kiểm tra Users
    const userCount = await User.countDocuments();
    console.log(`👥 Số lượng users: ${userCount}`);
    if (userCount > 0) {
      const users = await User.find({}, 'username email role').limit(5);
      console.log('📋 Danh sách users:');
      users.forEach((u, i) => {
        console.log(`   ${i + 1}. ${u.username} (${u.email}) - Role: ${u.role}`);
      });
    }
    console.log('');

    // Kiểm tra Orders
    const orderCount = await Order.countDocuments();
    console.log(`📦 Số lượng đơn hàng: ${orderCount}`);
    if (orderCount > 0) {
      const orders = await Order.find({}, 'orderId email amount status').limit(5);
      console.log('📋 Danh sách đơn hàng:');
      orders.forEach((o, i) => {
        console.log(`   ${i + 1}. Order ID: ${o.orderId} - Email: ${o.email} - Amount: $${o.amount} - Status: ${o.status}`);
      });
    }
    console.log('');

    // Kiểm tra Products
    const productCount = await Product.countDocuments();
    console.log(`🛍️  Số lượng sản phẩm: ${productCount}`);
    if (productCount > 0) {
      const products = await Product.find({}, 'name price category').limit(5);
      console.log('📋 Danh sách sản phẩm:');
      products.forEach((p, i) => {
        console.log(`   ${i + 1}. ${p.name} - $${p.price} - Category: ${p.category}`);
      });
    }

    await mongoose.disconnect();
    console.log('\n✅ Đã ngắt kết nối MongoDB.');
  } catch (error) {
    console.error('❌ Lỗi:', error.message);
    console.error('\n💡 Hướng dẫn:');
    console.error('   1. Đảm bảo MongoDB đã được cài đặt và đang chạy');
    console.error('   2. Kiểm tra service MongoDB: services.msc (Windows)');
    console.error('   3. Hoặc chạy MongoDB Compass để kiểm tra kết nối');
    console.error('   4. URL mặc định: mongodb://127.0.0.1:27017/lebaba_ecommerce');
    process.exit(1);
  }
}

checkMongoDB();


