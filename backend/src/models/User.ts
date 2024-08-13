import mongoose, { Document, Schema } from 'mongoose';
import { User } from '@tree-hole/shared';

interface InternalUser extends Omit<User, 'id'> {
  password: string;
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