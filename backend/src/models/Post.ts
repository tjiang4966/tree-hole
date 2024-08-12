import mongoose, { Document, Schema } from 'mongoose';
import { Post } from '@tree-hole/shared';

interface InternalPost extends Omit<Post, 'id' | 'author'> {
  author: mongoose.Types.ObjectId;
}

export interface PostDocument extends InternalPost, Document {}

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
      author: ret.author.toString(), // 假设 author 是 ObjectId
      likes: ret.likes,
      comments: ret.comments,
      createdAt: ret.createdAt,
      updatedAt: ret.updatedAt
    };
    delete ret._id;
    delete ret.__v;
    return post;
  }
});

export const PostModel = mongoose.model<PostDocument>('Post', postSchema);