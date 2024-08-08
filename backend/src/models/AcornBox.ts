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
  content: string;
  author: mongoose.Types.ObjectId;
  anonymousId: string;
  status: 'available' | 'opened' | 'deleted';
  allowReplies: boolean;
  createdAt: Date;
  openedBy?: mongoose.Types.ObjectId;
  openedAt?: Date;
}

const AcornBoxSchema: Schema = new Schema({
  content: { type: String, required: true, maxlength: 1000 },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  anonymousId: { type: String, required: true, unique: true },
  status: { type: String, enum: ['available', 'opened', 'deleted'], default: 'available' },
  allowReplies: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  openedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  openedAt: Date
});

export default mongoose.model<IAcornBox>('AcornBox', AcornBoxSchema);