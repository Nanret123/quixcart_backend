import mongoose from 'mongoose';
import { config } from 'dotenv';
import { ProductSchema } from './src/database/schemas/product.schema';
config(); // Load environment variables

// MongoDB Connection
async function connectDB() {
  try {
    await mongoose.connect(
      process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ecommerce',
      {},
    );
    console.log('✅ Database connected');
  } catch (err) {
    console.error('❌ Database connection error:', err);
    process.exit(1); // Exit process if connection fails
  }
}

// ✅ Create the Mongoose model before using it
const ProductModel = mongoose.model('Product', ProductSchema);

async function seedProducts() {
  try {
    const count = await ProductModel.countDocuments();
    if (count > 0) {
      console.log('Users already exist, skipping seed');
      return;
    }

    const products = [
      {
        name: 'Leather Handbag',
        category: 'accessories',
        description: 'Stylish leather handbag with ample storage space.',
        price: 79.99,
        oldPrice: 99.99,
        image:
          'https://images.unsplash.com/photo-1512201078372-9c6b2a0d528a?q=80&w=2073&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        color: 'black',
        rating: 4.5,
        author: new mongoose.Types.ObjectId('67ae6fe84fa43874af39d89f'),
      },
      {
        name: 'Evening Gown',
        category: 'dress',
        description: 'Elegant evening gown for special occasions.',
        price: 149.99,
        oldPrice: 199.99,
        image:
          'https://images.unsplash.com/photo-1568251188392-ae32f898cb3b?q=80&w=2062&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        color: 'red',
        rating: 4.0,
        author: new mongoose.Types.ObjectId('67ae6fe84fa43874af39d89f'),
      },
      {
        name: 'Gold Necklace',
        category: 'jewellery',
        description: 'Exquisite gold necklace with intricate design.',
        price: 199.99,
        image:
          'https://images.unsplash.com/photo-1631097969294-c38afba59496?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        color: 'gold',
        rating: 4.7,
        author: new mongoose.Types.ObjectId('67ae6fe84fa43874af39d89f'),
      },
      {
        name: 'Matte Lipstick',
        category: 'cosmetics',
        description: 'Long-lasting matte lipstick in various shades.',
        price: 19.99,
        image:
          'https://images.unsplash.com/photo-1631214500115-598fc2cb8d2d?q=80&w=1925&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        color: 'red',
        rating: 4.2,
        author: new mongoose.Types.ObjectId('67ae6fe84fa43874af39d89f'),
      },
      {
        name: 'Silk Scarf',
        category: 'accessories',
        description: 'Luxurious silk scarf with vibrant colors.',
        price: 29.99,
        oldPrice: 39.99,
        image:
          'https://images.unsplash.com/photo-1485527691629-8e370684924c?q=80&w=2074&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        color: 'blue',
        rating: 4.3,
        author: new mongoose.Types.ObjectId('67ae6fe84fa43874af39d89f'),
      },
      {
        name: 'Cocktail Dress',
        category: 'dress',
        description: 'Chic cocktail dress for parties and events.',
        price: 89.99,
        image:
          'https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=2073&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        color: 'black',
        rating: 4.4,
        author: new mongoose.Types.ObjectId('67ae6fe84fa43874af39d89f'),
      },
      {
        name: 'Diamond Earrings',
        category: 'jewellery',
        description:
          'Sparkling diamond earrings that add elegance to any outfit.',
        price: 299.99,
        oldPrice: 349.99,
        image:
          'https://images.unsplash.com/photo-1587467442586-7bcc51828a10?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        color: 'silver',
        rating: 4.8,
        author: new mongoose.Types.ObjectId('67ae6fe84fa43874af39d89f'),
      },
    ];

    await ProductModel.insertMany(products);
    console.log('Users seeded successfully');
  } catch (err) {
    console.error('Error seeding users:', err);
  } finally {
    mongoose.connection.close();
  }
}

async function main() {
  await connectDB();
  await seedProducts();
  process.exit(0); // Exit process after seeding
}

main();
