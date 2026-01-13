const mongoose = require('mongoose');
const Product = require('./src/products/products.model');

const products = [
    {
        "name": "Leather Handbag",
        "category": "accessories",
        "description": "Stylish leather handbag with ample storage space.",
        "price": 79.99,
        "oldPrice": 99.99,
        "image": "https://images.unsplash.com/photo-1512201078372-9c6b2a0d528a?q=80&w=2073&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "color": "black",
        "rating": 4.5,
        "author": "696529d27bf6626cb728de73"
    },
    {
        "name": "Evening Gown",
        "category": "dress",
        "description": "Elegant evening gown for special occasions.",
        "price": 149.99,
        "oldPrice": 199.99,
        "image": "https://images.unsplash.com/photo-1568251188392-ae32f898cb3b?q=80&w=2062&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "color": "red",
        "rating": 4.0,
        "author": "696529d27bf6626cb728de73"
    },
    {
        "name": "Gold Necklace",
        "category": "jewellery",
        "description": "Exquisite gold necklace with intricate design.",
        "price": 199.99,
        "image": "https://images.unsplash.com/photo-1631097969294-c38afba59496?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "color": "gold",
        "rating": 4.7,
        "author": "696529d27bf6626cb728de73"
    },
    {
        "name": "Matte Lipstick",
        "category": "cosmetics",
        "description": "Long-lasting matte lipstick in various shades.",
        "price": 19.99,
        "image": "https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=1915&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "color": "red",
        "rating": 4.2,
        "author": "696529d27bf6626cb728de73"
    },
    {
        "name": "Silk Scarf",
        "category": "accessories",
        "description": "Luxurious silk scarf with vibrant colors.",
        "price": 29.99,
        "oldPrice": 39.99,
        "image": "https://images.unsplash.com/photo-1485527691629-8e370684924c?q=80&w=2074&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "color": "blue",
        "rating": 4.3,
        "author": "696529d27bf6626cb728de73"
    },
    {
        "name": "Cocktail Dress",
        "category": "dress",
        "description": "Chic cocktail dress for parties and events.",
        "price": 89.99,
        "image": "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=2073&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "color": "black",
        "rating": 4.4,
        "author": "696529d27bf6626cb728de73"
    },
    {
        "name": "Diamond Earrings",
        "category": "jewellery",
        "description": "Sparkling diamond earrings that add elegance to any outfit.",
        "price": 299.99,
        "oldPrice": 349.99,
        "image": "https://images.unsplash.com/photo-1587467442586-7bcc51828a10?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "color": "silver",
        "rating": 4.8,
        "author": "696529d27bf6626cb728de73"
    },
    {
        "name": "Foundation Makeup",
        "category": "cosmetics",
        "description": "High-coverage foundation for a flawless finish.",
        "price": 39.99,
        "image": "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "color": "beige",
        "rating": 4.1,
        "author": "696529d27bf6626cb728de73"
    },
    {
        "name": "Sunglasses",
        "category": "accessories",
        "description": "Trendy sunglasses with UV protection.",
        "price": 49.99,
        "image": "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "color": "black",
        "rating": 4.6,
        "author": "696529d27bf6626cb728de73"
    },
    {
        "name": "Maxi Dress",
        "category": "dress",
        "description": "Comfortable maxi dress for casual outings.",
        "price": 59.99,
        "oldPrice": 79.99,
        "image": "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "color": "green",
        "rating": 4.2,
        "author": "696529d27bf6626cb728de73"
    },
    {
        "name": "Designer Wallet",
        "category": "accessories",
        "description": "Premium leather wallet with multiple card slots.",
        "price": 69.99,
        "oldPrice": 89.99,
        "image": "https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "color": "brown",
        "rating": 4.4,
        "author": "696529d27bf6626cb728de73"
    },
    {
        "name": "Summer Dress",
        "category": "dress",
        "description": "Light and airy summer dress perfect for warm weather.",
        "price": 49.99,
        "oldPrice": 69.99,
        "image": "https://images.unsplash.com/photo-1594633313593-bab3825d0caf?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "color": "blue",
        "rating": 4.5,
        "author": "696529d27bf6626cb728de73"
    },
    {
        "name": "Pearl Bracelet",
        "category": "jewellery",
        "description": "Elegant pearl bracelet with silver clasp.",
        "price": 129.99,
        "image": "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "color": "silver",
        "rating": 4.6,
        "author": "696529d27bf6626cb728de73"
    },
    {
        "name": "Mascara",
        "category": "cosmetics",
        "description": "Volumizing mascara for longer, fuller lashes.",
        "price": 24.99,
        "image": "https://images.unsplash.com/photo-1631214500115-598fc2cb8d2d?q=80&w=1925&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "color": "black",
        "rating": 4.3,
        "author": "696529d27bf6626cb728de73"
    },
    {
        "name": "Leather Belt",
        "category": "accessories",
        "description": "Classic leather belt with adjustable buckle.",
        "price": 39.99,
        "image": "https://images.unsplash.com/photo-1624222247344-550fb60583fd?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "color": "black",
        "rating": 4.2,
        "author": "696529d27bf6626cb728de73"
    },
    {
        "name": "Formal Dress",
        "category": "dress",
        "description": "Sophisticated formal dress for business occasions.",
        "price": 119.99,
        "oldPrice": 149.99,
        "image": "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "color": "black",
        "rating": 4.7,
        "author": "696529d27bf6626cb728de73"
    },
    {
        "name": "Silver Ring",
        "category": "jewellery",
        "description": "Beautiful silver ring with intricate patterns.",
        "price": 89.99,
        "image": "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "color": "silver",
        "rating": 4.5,
        "author": "696529d27bf6626cb728de73"
    },
    {
        "name": "Eyeshadow Palette",
        "category": "cosmetics",
        "description": "12-color eyeshadow palette with matte and shimmer shades.",
        "price": 34.99,
        "oldPrice": 49.99,
        "image": "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "color": "multi",
        "rating": 4.4,
        "author": "696529d27bf6626cb728de73"
    },
    {
        "name": "Crossbody Bag",
        "category": "accessories",
        "description": "Stylish crossbody bag perfect for everyday use.",
        "price": 54.99,
        "image": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "color": "brown",
        "rating": 4.3,
        "author": "696529d27bf6626cb728de73"
    },
    {
        "name": "Floral Print Dress",
        "category": "dress",
        "description": "Beautiful floral print dress for spring and summer.",
        "price": 69.99,
        "image": "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "color": "multi",
        "rating": 4.6,
        "author": "696529d27bf6626cb728de73"
    },
    {
        "name": "Ruby Pendant",
        "category": "jewellery",
        "description": "Stunning ruby pendant on a gold chain.",
        "price": 249.99,
        "oldPrice": 299.99,
        "image": "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "color": "red",
        "rating": 4.8,
        "author": "696529d27bf6626cb728de73"
    },
    {
        "name": "Blush Compact",
        "category": "cosmetics",
        "description": "Natural-looking blush for a healthy glow.",
        "price": 22.99,
        "image": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "color": "pink",
        "rating": 4.2,
        "author": "696529d27bf6626cb728de73"
    },
    {
        "name": "Baseball Cap",
        "category": "accessories",
        "description": "Classic baseball cap with adjustable strap.",
        "price": 24.99,
        "image": "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "color": "black",
        "rating": 4.1,
        "author": "696529d27bf6626cb728de73"
    },
    {
        "name": "Wrap Dress",
        "category": "dress",
        "description": "Flattering wrap dress that suits all body types.",
        "price": 79.99,
        "image": "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "color": "blue",
        "rating": 4.5,
        "author": "696529d27bf6626cb728de73"
    },
    {
        "name": "Charm Bracelet",
        "category": "jewellery",
        "description": "Delicate charm bracelet with multiple charms.",
        "price": 159.99,
        "image": "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "color": "silver",
        "rating": 4.7,
        "author": "696529d27bf6626cb728de73"
    },
    {
        "name": "Concealer",
        "category": "cosmetics",
        "description": "Full-coverage concealer for blemishes and dark circles.",
        "price": 27.99,
        "image": "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "color": "beige",
        "rating": 4.3,
        "author": "696529d27bf6626cb728de73"
    },
    {
        "name": "Leather Gloves",
        "category": "accessories",
        "description": "Warm leather gloves for winter season.",
        "price": 44.99,
        "image": "https://images.unsplash.com/photo-1601925260368-ae2f83d34b08?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "color": "brown",
        "rating": 4.4,
        "author": "696529d27bf6626cb728de73"
    },
    {
        "name": "A-Line Dress",
        "category": "dress",
        "description": "Classic A-line dress that never goes out of style.",
        "price": 94.99,
        "oldPrice": 119.99,
        "image": "https://images.unsplash.com/photo-1566479179817-38efb9e8c5b0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "color": "red",
        "rating": 4.6,
        "author": "696529d27bf6626cb728de73"
    },
    {
        "name": "Emerald Ring",
        "category": "jewellery",
        "description": "Stunning emerald ring set in white gold.",
        "price": 399.99,
        "oldPrice": 449.99,
        "image": "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "color": "green",
        "rating": 4.9,
        "author": "696529d27bf6626cb728de73"
    },
    {
        "name": "Setting Spray",
        "category": "cosmetics",
        "description": "Long-lasting setting spray to keep makeup in place.",
        "price": 29.99,
        "image": "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "color": "clear",
        "rating": 4.5,
        "author": "696529d27bf6626cb728de73"
    },
    {
        "name": "Tote Bag",
        "category": "accessories",
        "description": "Spacious tote bag perfect for shopping or beach trips.",
        "price": 64.99,
        "image": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "color": "beige",
        "rating": 4.4,
        "author": "696529d27bf6626cb728de73"
    },
    {
        "name": "Bodycon Dress",
        "category": "dress",
        "description": "Fitted bodycon dress for a sleek silhouette.",
        "price": 84.99,
        "image": "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "color": "black",
        "rating": 4.5,
        "author": "696529d27bf6626cb728de73"
    },
    {
        "name": "Tennis Bracelet",
        "category": "jewellery",
        "description": "Elegant tennis bracelet with diamonds.",
        "price": 599.99,
        "oldPrice": 699.99,
        "image": "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "color": "silver",
        "rating": 4.9,
        "author": "696529d27bf6626cb728de73"
    },
    {
        "name": "Highlighter",
        "category": "cosmetics",
        "description": "Luminous highlighter for a radiant glow.",
        "price": 26.99,
        "image": "https://images.unsplash.com/photo-1631214500115-598fc2cb8d2d?q=80&w=1925&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "color": "gold",
        "rating": 4.4,
        "author": "696529d27bf6626cb728de73"
    },
    {
        "name": "Backpack",
        "category": "accessories",
        "description": "Stylish backpack for work or travel.",
        "price": 74.99,
        "oldPrice": 99.99,
        "image": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "color": "black",
        "rating": 4.6,
        "author": "696529d27bf6626cb728de73"
    },
    {
        "name": "Midi Dress",
        "category": "dress",
        "description": "Versatile midi dress for any occasion.",
        "price": 69.99,
        "image": "https://images.unsplash.com/photo-1594633313593-bab3825d0caf?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "color": "blue",
        "rating": 4.4,
        "author": "696529d27bf6626cb728de73"
    },
    {
        "name": "Anklet",
        "category": "jewellery",
        "description": "Delicate anklet with small charms.",
        "price": 49.99,
        "image": "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "color": "silver",
        "rating": 4.3,
        "author": "696529d27bf6626cb728de73"
    },
    {
        "name": "Bronzer",
        "category": "cosmetics",
        "description": "Natural bronzer for a sun-kissed look.",
        "price": 28.99,
        "image": "https://images.unsplash.com/photo-1631214500115-598fc2cb8d2d?q=80&w=1925&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "color": "brown",
        "rating": 4.3,
        "author": "696529d27bf6626cb728de73"
    },
    {
        "name": "Hair Clip",
        "category": "accessories",
        "description": "Decorative hair clip with pearl details.",
        "price": 19.99,
        "image": "https://images.unsplash.com/photo-1601925260368-ae2f83d34b08?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "color": "silver",
        "rating": 4.2,
        "author": "696529d27bf6626cb728de73"
    },
    {
        "name": "Shift Dress",
        "category": "dress",
        "description": "Comfortable shift dress with modern cut.",
        "price": 79.99,
        "oldPrice": 99.99,
        "image": "https://images.unsplash.com/photo-1594633313593-bab3825d0caf?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "color": "green",
        "rating": 4.5,
        "author": "696529d27bf6626cb728de73"
    }
];

// Connect to MongoDB
mongoose.connect('mongodb://mongo:27017/lebaba_ecommerce')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));

const seedProducts = async () => {
    try {
        console.log('Clearing existing products...');
        await Product.deleteMany({}); // Optional: Clear old data or not

        console.log('Inserting products...');
        await Product.insertMany(products);

        console.log('✅ Database seeded successfully!');
    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        mongoose.disconnect();
    }
};

seedProducts();
