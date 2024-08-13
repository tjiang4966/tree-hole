import mongoose, { Document, Schema } from 'mongoose';
import { Post } from '@tree-hole/shared';

interface InternalPost extends Omit<Post, 'id' | 'author'> {
  author: mongoose.Types.ObjectId;
}

export interface PostDocument extends InternalPost, Document {}

/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       required:
 *         - content
 *         - author
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the post
 *         content:
 *           type: string
 *           description: The content of the post
 *         author:
 *           type: string
 *           description: The id of the user who created the post
 *         likes:
 *           type: number
 *           description: The number of likes on the post
 *         comments:
 *           type: number
 *           description: The number of comments on the post
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the post was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date the post was last updated
 */

const postSchema = new Schema<PostDocument>({
  content: { 
    type: String, 
    required: true 
  },
  author: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  likes: { 
    type: Number, 
    default: 0 
  },
  comments: { 
    type: Number, 
    default: 0 
  }
}, { 
  timestamps: true 
});

postSchema.set('toJSON', {
  transform: (doc, ret) => {
    const post: Post = {
      id: ret._id.toString(),
      content: ret.content,
      author: ret.author.toString(),
      likes: ret.likes,
      comments: ret.comments,
      createdAt: ret.createdAt,
      updatedAt: ret.updatedAt
    };
    return post;
  }
});

export const PostModel = mongoose.model<PostDocument>('Post', postSchema);