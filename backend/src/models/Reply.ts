// src/models/Reply.ts

import mongoose, { Document, Schema } from 'mongoose';

export interface IReply extends Document {
  content: string;                  // 回复内容
  acornBox: mongoose.Types.ObjectId;  // 所属橡果盒ID
  author: mongoose.Types.ObjectId;  // 回复者的用户ID
  createdAt: Date;                  // 创建时间
  isRead: boolean;                  // 是否已读
}

const ReplySchema: Schema = new Schema({
  content: { 
    type: String, 
    required: true, 
    maxlength: 500,
    // 回复内容，必填，最大长度500字符
  },
  acornBox: { 
    type: Schema.Types.ObjectId, 
    ref: 'AcornBox', 
    required: true,
    // 所属橡果盒ID，关联到AcornBox模型，必填
  },
  author: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    // 回复者的用户ID，关联到User模型，必填
  },
  createdAt: { 
    type: Date, 
    default: Date.now,
    // 创建时间，默认为当前时间
  },
  isRead: { 
    type: Boolean, 
    default: false,
    // 是否已读，默认为false
  }
});

export default mongoose.model<IReply>('Reply', ReplySchema);