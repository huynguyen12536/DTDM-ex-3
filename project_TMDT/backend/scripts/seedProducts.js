const mongoose = require('mongoose');
require('dotenv').config();

const Product = require('../src/products/products.model');
const User = require('../src/users/user.model');

const mongoUrl = process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017/lebaba_ecommerce';

// Products data - đảm bảo không trùng và ảnh đúng
const productsData = [
  { name: "Leather Handbag", category: "accessories", description: "Stylish leather handbag with ample storage space.", price: 79.99, oldPrice: 99.99, image: "https://images.pexels.com/photos/167703/pexels-photo-167703.jpeg?auto=compress&cs=tinysrgb&w=800", color: "black", rating: 4.5 },
  { name: "Gold Necklace", category: "jewellery", description: "Exquisite gold necklace with intricate design.", price: 199.99, image: "https://images.pexels.com/photos/261327/pexels-photo-261327.jpeg?auto=compress&cs=tinysrgb&w=800", color: "gold", rating: 4.7 },
  { name: "Matte Lipstick", category: "cosmetics", description: "Long-lasting matte lipstick in various shades.", price: 19.99, image: "https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg?auto=compress&cs=tinysrgb&w=800", color: "red", rating: 4.2 },
  { name: "Silk Scarf", category: "accessories", description: "Luxurious silk scarf with vibrant colors.", price: 29.99, oldPrice: 39.99, image: "https://images.pexels.com/photos/994517/pexels-photo-994517.jpeg?auto=compress&cs=tinysrgb&w=800", color: "blue", rating: 4.3 },
  { name: "Foundation Makeup", category: "cosmetics", description: "High-coverage foundation for a flawless finish.", price: 39.99, image: "https://images.pexels.com/photos/3373742/pexels-photo-3373742.jpeg?auto=compress&cs=tinysrgb&w=800", color: "beige", rating: 4.1 },
  { name: "Sunglasses", category: "accessories", description: "Trendy sunglasses with UV protection.", price: 49.99, image: "https://images.pexels.com/photos/551628/pexels-photo-551628.jpeg?auto=compress&cs=tinysrgb&w=800", color: "black", rating: 4.6 },
  { name: "Maxi Dress", category: "dress", description: "Comfortable maxi dress for casual outings.", price: 59.99, oldPrice: 79.99, image: "https://images.pexels.com/photos/1382731/pexels-photo-1382731.jpeg?auto=compress&cs=tinysrgb&w=800", color: "green", rating: 4.2 },
  { name: "Summer Dress", category: "dress", description: "Light and airy summer dress perfect for warm weather.", price: 49.99, oldPrice: 69.99, image: "https://images.pexels.com/photos/2065198/pexels-photo-2065198.jpeg?auto=compress&cs=tinysrgb&w=800", color: "blue", rating: 4.5 },
  { name: "Pearl Bracelet", category: "jewellery", description: "Elegant pearl bracelet with silver clasp.", price: 129.99, image: "https://images.pexels.com/photos/3641059/pexels-photo-3641059.jpeg?auto=compress&cs=tinysrgb&w=800", color: "silver", rating: 4.6 },
  { name: "Mascara", category: "cosmetics", description: "Volumizing mascara for longer, fuller lashes.", price: 24.99, image: "https://images.pexels.com/photos/3373746/pexels-photo-3373746.jpeg?auto=compress&cs=tinysrgb&w=800", color: "black", rating: 4.3 },
  { name: "Formal Business Dress", category: "dress", description: "Sophisticated formal dress for business occasions.", price: 119.99, oldPrice: 149.99, image: "https://images.pexels.com/photos/3760915/pexels-photo-3760915.jpeg?auto=compress&cs=tinysrgb&w=800", color: "black", rating: 4.7 },
  { name: "Silver Ring", category: "jewellery", description: "Beautiful silver ring with intricate patterns.", price: 89.99, image: "https://images.pexels.com/photos/1453005/pexels-photo-1453005.jpeg?auto=compress&cs=tinysrgb&w=800", color: "silver", rating: 4.5 },
  { name: "Crossbody Bag", category: "accessories", description: "Stylish crossbody bag perfect for everyday use.", price: 54.99, image: "https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg?auto=compress&cs=tinysrgb&w=800", color: "brown", rating: 4.3 },
  { name: "Ruby Pendant", category: "jewellery", description: "Stunning ruby pendant on a gold chain.", price: 249.99, oldPrice: 299.99, image: "https://images.pexels.com/photos/3641055/pexels-photo-3641055.jpeg?auto=compress&cs=tinysrgb&w=800", color: "red", rating: 4.8 },
  { name: "Blush Compact", category: "cosmetics", description: "Natural-looking blush for a healthy glow.", price: 22.99, image: "https://images.pexels.com/photos/3373743/pexels-photo-3373743.jpeg?auto=compress&cs=tinysrgb&w=800", color: "pink", rating: 4.2 },
  { name: "Wrap Dress", category: "dress", description: "Flattering wrap dress that suits all body types.", price: 79.99, image: "https://images.pexels.com/photos/1484798/pexels-photo-1484798.jpeg?auto=compress&cs=tinysrgb&w=800", color: "blue", rating: 4.5 },
  { name: "Leather Gloves", category: "accessories", description: "Warm leather gloves for winter season.", price: 44.99, image: "https://images.pexels.com/photos/3864106/pexels-photo-3864106.jpeg?auto=compress&cs=tinysrgb&w=800", color: "brown", rating: 4.4 },
  { name: "A-Line Dress", category: "dress", description: "Classic A-line dress that never goes out of style.", price: 94.99, oldPrice: 119.99, image: "https://images.pexels.com/photos/1580271/pexels-photo-1580271.jpeg?auto=compress&cs=tinysrgb&w=800", color: "red", rating: 4.6 },
  { name: "Setting Spray", category: "cosmetics", description: "Long-lasting setting spray to keep makeup in place.", price: 29.99, image: "https://images.pexels.com/photos/3373744/pexels-photo-3373744.jpeg?auto=compress&cs=tinysrgb&w=800", color: "clear", rating: 4.5 },
  { name: "Tote Bag", category: "accessories", description: "Spacious tote bag perfect for shopping or beach trips.", price: 64.99, image: "https://images.pexels.com/photos/1661470/pexels-photo-1661470.jpeg?auto=compress&cs=tinysrgb&w=800", color: "beige", rating: 4.4 },
  { name: "Tennis Bracelet", category: "jewellery", description: "Elegant tennis bracelet with diamonds.", price: 599.99, oldPrice: 699.99, image: "https://images.pexels.com/photos/845434/pexels-photo-845434.jpeg?auto=compress&cs=tinysrgb&w=800", color: "silver", rating: 4.9 },
  { name: "Backpack", category: "accessories", description: "Stylish backpack for work or travel.", price: 74.99, oldPrice: 99.99, image: "https://images.pexels.com/photos/3747464/pexels-photo-3747464.jpeg?auto=compress&cs=tinysrgb&w=800", color: "black", rating: 4.6 },
  { name: "Midi Dress", category: "dress", description: "Versatile midi dress for any occasion.", price: 69.99, image: "https://images.pexels.com/photos/2872418/pexels-photo-2872418.jpeg?auto=compress&cs=tinysrgb&w=800", color: "blue", rating: 4.4 },
  { name: "Bronzer", category: "cosmetics", description: "Natural bronzer for a sun-kissed look.", price: 28.99, image: "https://images.pexels.com/photos/3373748/pexels-photo-3373748.jpeg?auto=compress&cs=tinysrgb&w=800", color: "brown", rating: 4.3 },
  { name: "Hair Clip", category: "accessories", description: "Decorative hair clip with pearl details.", price: 19.99, image: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=800", color: "silver", rating: 4.2 },
  { name: "Shift Dress", category: "dress", description: "Comfortable shift dress with modern cut.", price: 79.99, oldPrice: 99.99, image: "https://images.pexels.com/photos/1394882/pexels-photo-1394882.jpeg?auto=compress&cs=tinysrgb&w=800", color: "green", rating: 4.5 },
  { name: "Makeup Brush Set", category: "cosmetics", description: "Complete brush set for flawless makeup application.", price: 34.99, image: "https://images.pexels.com/photos/211265/pexels-photo-211265.jpeg?auto=compress&cs=tinysrgb&w=800", color: "rose gold", rating: 4.6 }
];
async function seedProducts() {
  try {
    await mongoose.connect(mongoUrl);
    console.log('✅ Connected to MongoDB');

    // Get admin user
    const admin = await User.findOne({ email: 'admin@gmail.com' });
    if (!admin) {
      console.error('❌ Admin user not found. Please run the server first to create default users.');
      process.exit(1);
    }

    // Delete all existing products
    await Product.deleteMany({});
    console.log('🗑️  Deleted all existing products');

    // Insert new products
    const productsToInsert = productsData.map(product => ({
      ...product,
      author: admin._id
    }));

    const insertedProducts = await Product.insertMany(productsToInsert);
    console.log(`✅ Successfully seeded ${insertedProducts.length} products`);

    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Error seeding products:', error);
    process.exit(1);
  }
}

seedProducts();

