const mongoose = require('mongoose');
const Product = require('./src/products/products.model');

// Connect to MongoDB
mongoose.connect('mongodb://mongo:27017/lebaba_ecommerce')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));

const createProduct = async () => {
    try {
        const newProduct = new Product({
            name: "Test Product",
            category: "fashion",
            description: "A test product created via seed script",
            price: 99,
            image: "https://placehold.co/600x400",
            rating: 5,
            author: "696529d27bf6626cb728de73" // Admin ID
        });

        const savedProduct = await newProduct.save();
        console.log('Product created:', savedProduct);
    } catch (error) {
        console.error('Error creating product:', error);
    } finally {
        mongoose.disconnect();
    }
};

createProduct();
