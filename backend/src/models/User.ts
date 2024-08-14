import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '@tree-hole/shared';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

interface InternalUser extends Omit<User, 'id'> {
  password: string;
  generateAuthToken: () => Promise<string>;
}

export interface UserDocument extends InternalUser, Document {}

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
 *         id:
 *           type: string
 *           description: The auto-generated id of the user
 *         username:
 *           type: string
 *           description: The username of the user
 *         email:
 *           type: string
 *           description: The email of the user
 *         password:
 *           type: string
 *           description: The user's password (hashed)
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the user was added
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date the user was updated
 */

const userSchema = new Schema<UserDocument>({
  username: { 
    type: String, 
    required: true, 
    unique: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  }
}, { 
  timestamps: true 
});

userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

userSchema.methods.generateAuthToken = async function() {
  const token = jwt.sign({ id: this._id.toString() }, JWT_SECRET);
  return token;
};

userSchema.set('toJSON', {
  transform: (doc, ret) => {
    const user: User = {
      id: ret._id.toString(),
      username: ret.username,
      email: ret.email,
      createdAt: ret.createdAt,
      updatedAt: ret.updatedAt
    };
    return user;
  }
});

export const UserModel = mongoose.model<UserDocument>('User', userSchema);