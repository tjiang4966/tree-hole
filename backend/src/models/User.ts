import mongoose, { Document, Schema } from 'mongoose';
import { User } from '@tree-hole/shared';

// 内部使用的扩展接口，包含密码字段，并Omit Mongoose 的 _id
interface InternalUser extends Omit<User, 'id'> {
  password: string;
}

// 文档接口，用于 Mongoose
export interface UserDocument extends InternalUser, Document {}

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

// 在返回用户信息时转换为符合 User 接口的格式
userSchema.set('toJSON', {
  transform: (doc, ret) => {
    const user: User = {
      id: ret._id.toString(),
      username: ret.username,
      email: ret.email,
      createdAt: ret.createdAt,
      updatedAt: ret.updatedAt
    };
    delete ret._id;
    delete ret.__v;
    delete ret.password;
    return user;
  }
});

export const UserModel = mongoose.model<UserDocument>('User', userSchema);