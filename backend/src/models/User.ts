// src/models/User.ts
import mongoose, { Document, Schema } from 'mongoose';

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           description: The user's username
 *         email:
 *           type: string
 *           description: The user's email
 *         password:
 *           type: string
 *           description: The user's password (hashed)
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the user was created
 *         lastLogin:
 *           type: string
 *           format: date-time
 *           description: The date of the user's last login
 *         isActive:
 *           type: boolean
 *           description: Whether the user's account is active
 */
export interface IUser extends Document {
  username: string;  // 用户名，唯一
  email: string;     // 电子邮箱，唯一
  password: string;  // 加密存储的密码
  createdAt: Date;   // 账户创建时间
  lastLogin: Date;   // 最后登录时间
  isActive: boolean; // 账户是否活跃
}

const UserSchema: Schema = new Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true,
    // 用户名，必填，且在数据库中唯一
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    // 电子邮箱，必填，且在数据库中唯一
  },
  password: { 
    type: String, 
    required: true,
    // 加密存储的密码，必填
  },
  createdAt: { 
    type: Date, 
    default: Date.now,
    // 账户创建时间，默认为当前时间
  },
  lastLogin: { 
    type: Date,
    // 最后登录时间
  },
  isActive: { 
    type: Boolean, 
    default: true,
    // 账户是否活跃，默认为true
  }
});

export default mongoose.model<IUser>('User', UserSchema);