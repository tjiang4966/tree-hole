// src/models/Reply.ts
import mongoose, { Document, Schema } from 'mongoose';

/**
 * @swagger
 * components:
 *   schemas:
 *     Reply:
 *       type: object
 *       required:
 *         - content
 *         - acornBox
 *         - author
 *       properties:
 *         content:
 *           type: string
 *           description: The content of the reply
 *         acornBox:
 *           type: string
 *           description: The ID of the acorn box this reply belongs to
 *         author:
 *           type: string
 *           description: The ID of the user who wrote the reply
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the reply was created
 *         isRead:
 *           type: boolean
 *           description: Whether the reply has been read by the recipient
 */
export interface IReply extends Document {
  content: string;
  acornBox: mongoose.Types.ObjectId;
  author: mongoose.Types.ObjectId;
  createdAt: Date;
  isRead: boolean;
}

const ReplySchema: Schema = new Schema({
  content: { type: String, required: true, maxlength: 500 },
  acornBox: { type: Schema.Types.ObjectId, ref: 'AcornBox', required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  isRead: { type: Boolean, default: false }
});

export default mongoose.model<IReply>('Reply', ReplySchema);