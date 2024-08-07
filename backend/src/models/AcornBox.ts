// src/models/AcornBox.ts

import mongoose, { Document, Schema } from 'mongoose';

export interface IAcornBox extends Document {
  content: string;                  // 橡果盒内容
  author: mongoose.Types.ObjectId;  // 作者的用户ID
  anonymousId: string;              // 匿名标识符
  status: 'available' | 'opened' | 'deleted';  // 状态：可用/已打开/已删除
  allowReplies: boolean;            // 是否允许回复
  createdAt: Date;                  // 创建时间
  openedBy?: mongoose.Types.ObjectId;  // 打开者的用户ID
  openedAt?: Date;                  // 打开时间
}

const AcornBoxSchema: Schema = new Schema({
  content: { 
    type: String, 
    required: true, 
    maxlength: 1000,
    // 橡果盒内容，必填，最大长度1000字符
  },
  author: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    // 作者的用户ID，关联到User模型，必填
  },
  anonymousId: { 
    type: String, 
    required: true, 
    unique: true,
    // 匿名标识符，必填，且在数据库中唯一
  },
  status: { 
    type: String, 
    enum: ['available', 'opened', 'deleted'], 
    default: 'available',
    // 状态：可用/已打开/已删除，默认为'available'
  },
  allowReplies: { 
    type: Boolean, 
    default: true,
    // 是否允许回复，默认为true
  },
  createdAt: { 
    type: Date, 
    default: Date.now,
    // 创建时间，默认为当前时间
  },
  openedBy: { 
    type: Schema.Types.ObjectId, 
    ref: 'User',
    // 打开者的用户ID，关联到User模型
  },
  openedAt: Date,  // 打开时间
});

export default mongoose.model<IAcornBox>('AcornBox', AcornBoxSchema);