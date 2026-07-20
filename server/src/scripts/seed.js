import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Item from '../models/Item.js';
import Event from '../models/Event.js';

dotenv.config();

/**
 * Seed Script
 * @todo Add more sample data
 * @todo Add relationships between data
 * @todo Add cleanup before seeding
 */

const sampleUsers = [
  {
    name: 'John Doe',
    email: 'john@acme.edu.np',
    password: 'password123',
    phone_num: '9841234567',
    faculty: 'BE Computer',
    studentStatus: 'current',
    semester: 6,
    isVerified: true,
  },
  {
    name: 'Jane Smith',
    email: 'jane@acme.edu.np',
    password: 'password123',
    phone_num: '9847654321',
    faculty: 'Architecture',
    studentStatus: 'current',
    semester: 4,
    isVerified: true,
  },
];

const sampleItems = [
  {
    title: 'Data Structures Book',
    category: 'books',
    description: 'Complete reference for Data Structures and Algorithms',
    condition: 'Good',
    tags: ['book', 'dsa', 'textbook'],
    number_of_items: 1,
    is_available: true,
    facultyRestriction: ['BE Computer'],
  },
  {
    title: 'Carpentry Tool Set',
    category: 'tools',
    description: 'Complete set of carpentry tools',
    condition: 'Like New',
    tags: ['tools', 'carpentry'],
    number_of_items: 1,
    is_available: true,
    facultyRestriction: ['Architecture', 'Civil'],
  },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/collegebuddy');
    console.log('🗑️ Cleaning database...');
    
    await User.deleteMany({});
    await Item.deleteMany({});
    await Event.deleteMany({});
    
    console.log('👤 Creating users...');
    const users = [];
    for (const userData of sampleUsers) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);
      const user = await User.create({
        ...userData,
        password: hashedPassword,
      });
      users.push(user);
    }

    console.log('📚 Creating items...');
    for (const itemData of sampleItems) {
      await Item.create({
        ...itemData,
        owner: users[0]._id,
      });
    }

    console.log('✅ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seedDatabase();