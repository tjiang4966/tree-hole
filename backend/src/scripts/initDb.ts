// src/scripts/initDb.ts

import mongoose from 'mongoose';
import { User, AcornBox, Reply } from '../models';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/treehole';

async function initDb() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // 创建索引
    await User.createIndexes();
    await AcornBox.createIndexes();
    await Reply.createIndexes();

    // 插入管理员用户（如果不存在）
    // const adminEmail = 'admin@example.com';
    // const existingAdmin = await User.findOne({ email: adminEmail });
    // if (!existingAdmin) {
    //   await User.create({
    //     username: 'admin',
    //     email: adminEmail,
    //     password: 'your_hashed_password_here', // 请使用正确的密码哈希
    //     isActive: true
    //   });
    //   console.log('Admin user created');
    // }

    console.log('Database initialization completed');
  } catch (error) {
    console.error('Database initialization failed:', error);
  } finally {
    await mongoose.disconnect();
  }
}

initDb();