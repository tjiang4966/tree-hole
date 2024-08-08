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
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  lastLogin: Date;
  isActive: boolean;
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date },
  isActive: { type: Boolean, default: true }
});

export default mongoose.model<IUser>('User', UserSchema);