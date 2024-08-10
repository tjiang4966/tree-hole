// src/models/AcornBox.ts
import mongoose, { Document, Schema } from 'mongoose';

/**
 * @swagger
 * components:
 *   schemas:
 *     AcornBox:
 *       type: object
 *       required:
 *         - content
 *         - author
 *         - anonymousId
 *       properties:
 *         content:
 *           type: string
 *           description: The content of the acorn box
 *         author:
 *           type: string
 *           description: The ID of the user who created the acorn box
 *         anonymousId:
 *           type: string
 *           description: A unique anonymous identifier for the acorn box
 *         status:
 *           type: string
 *           enum: [available, opened, deleted]
 *           description: The current status of the acorn box
 *         allowReplies:
 *           type: boolean
 *           description: Whether replies are allowed for this acorn box
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the acorn box was created
 *         openedBy:
 *           type: string
 *           description: The ID of the user who opened the acorn box
 *         openedAt:
 *           type: string
 *           format: date-time
 *           description: The date the acorn box was opened
 */
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