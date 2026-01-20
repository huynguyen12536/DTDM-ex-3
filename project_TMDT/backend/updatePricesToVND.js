const mongoose = require('mongoose');
require('dotenv').config();

const Product = require('./src/products/products.model');

// Load MongoDB URL from .env or default to local/docker
const mongoUrl = process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017/lebaba_ecommerce';

async function updatePrices() {
  try {
    console.log('Connecting to MongoDB at:', mongoUrl);
    await mongoose.connect(mongoUrl);
    console.log('✅ Connected to MongoDB');

    const products = await Product.find({});
    console.log(`Found ${products.length} products to update.`);

    let updatedCount = 0;
    for (const product of products) {
      // Multiply by 25000 and round to nearest VND
      const newPrice = Math.round(product.price * 25000);
      const newOldPrice = product.oldPrice ? Math.round(product.oldPrice * 25000) : undefined;

      console.log(`Updating "${product.name}": ${product.price} -> ${newPrice}`);

      product.price = newPrice;
      if (newOldPrice) {
        product.oldPrice = newOldPrice;
      }
      
      await product.save();
      updatedCount++;
    }

    console.log(`✅ Successfully updated ${updatedCount} products to VND.`);
    
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating prices:', error);
    process.exit(1);
  }
}

updatePrices();
