import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Item from '../models/Item.js';

dotenv.config();

const categories = ['BOOKS', 'TOOLS', 'NOTES', 'GAMES', 'ELECTRONICS', 'OTHER'];
const conditions = ['NEW', 'GOOD', 'FAIR', 'WORN'];

const seedItems = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/collegebuddy');
    console.log('✅ Connected to MongoDB');

    // 1. Idempotent: Delete existing demo items first (using the 'isDemo' tag)
    console.log('🗑️ Clearing existing demo items...');
    await Item.deleteMany({ tags: 'isDemo' });

    // 2. Fetch random users to assign as owners
    const users = await User.find({});
    if (users.length === 0) {
      console.log('❌ No users found in the database. Please create a user first.');
      process.exit(1);
    }

    // 3. Generate 30 items
    const itemsToInsert = [];
    for (let i = 1; i <= 30; i++) {
      // Pick a random user
      const randomUser = users[Math.floor(Math.random() * users.length)];
      // Pick a random category and condition
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];

      itemsToInsert.push({
        title: `Demo Item ${i} - ${randomCategory}`,
        description: `This is a demo ${randomCategory.toLowerCase()} item generated for testing and demo day.`,
        category: randomCategory,
        condition: randomCondition,
        tags: ['isDemo', 'demoData'],
        owner: randomUser._id,
        status: 'available',
        images: [],
        views: 0
      });
    }

    // 4. Insert all items
    await Item.insertMany(itemsToInsert);

    // 5. Log the count
    console.log(`🎉 Successfully seeded 30 demo items!`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seedItems();