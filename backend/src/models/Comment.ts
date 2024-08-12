import mongoose, { Document, Schema } from 'mongoose';
import { Comment } from '@tree-hole/shared';

interface InternalComment extends Omit<Comment, 'id' | 'author' | 'post'> {
  author: mongoose.Types.ObjectId;
  post: mongoose.Types.ObjectId;
}

export interface CommentDocument extends InternalComment, Document {}

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

// 添加复合索引以优化查询性能
commentSchema.index({ post: 1, createdAt: -1 });

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
    // 明确删除 Mongoose 特有的字段
    delete ret._id;
    delete ret.__v;
    return comment;
  }
});

export const CommentModel = mongoose.model<CommentDocument>('Comment', commentSchema);