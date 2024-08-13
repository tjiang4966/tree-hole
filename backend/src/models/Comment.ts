import mongoose, { Document, Schema } from 'mongoose';
import { Comment } from '@tree-hole/shared';

interface InternalComment extends Omit<Comment, 'id' | 'author' | 'post'> {
  author: mongoose.Types.ObjectId;
  post: mongoose.Types.ObjectId;
}

export interface CommentDocument extends InternalComment, Document {}

/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       required:
 *         - content
 *         - author
 *         - post
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the comment
 *         content:
 *           type: string
 *           description: The content of the comment
 *         author:
 *           type: string
 *           description: The id of the user who created the comment
 *         post:
 *           type: string
 *           description: The id of the post this comment belongs to
 *         likes:
 *           type: number
 *           description: The number of likes on the comment
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the comment was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date the comment was last updated
 */

const commentSchema = new Schema<CommentDocument>({
  content: { 
    type: String, 
    required: true 
  },
  author: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  post: { 
    type: Schema.Types.ObjectId, 
    ref: 'Post', 
    required: true 
  },
  likes: { 
    type: Number, 
    default: 0 
  }
}, { 
  timestamps: true 
});

commentSchema.set('toJSON', {
  transform: (doc, ret) => {
    const comment: Comment = {
      id: ret._id.toString(),
      content: ret.content,
      author: ret.author.toString(),
      post: ret.post.toString(),
      likes: ret.likes,
      createdAt: ret.createdAt,
      updatedAt: ret.updatedAt
    };
    return comment;
  }
});

export const CommentModel = mongoose.model<CommentDocument>('Comment', commentSchema);