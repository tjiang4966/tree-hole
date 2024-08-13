// backend/src/controllers/commentController.ts

import { Request, Response } from 'express';
import { CommentModel } from '../models/Comment';
import { PostModel } from '../models/Post';
import { CreateCommentDto, UpdateCommentDto } from '@tree-hole/shared';

export const commentController = {
  async createComment(req: Request<{}, {}, CreateCommentDto>, res: Response) {
    try {
      const post = await PostModel.findById(req.body.post);
      if (!post) {
        return res.status(400).json({ message: 'Invalid post' });
      }
      const comment = new CommentModel(req.body);
      await comment.save();
      
      // 更新帖子的评论数
      await PostModel.findByIdAndUpdate(req.body.post, { $inc: { comments: 1 } });
      
      res.status(201).json(comment.toJSON());
    } catch (error) {
      res.status(400).json({ message: '创建评论失败', error: (error as Error).message });
    }
  },

  async getComment(req: Request<{ id: string }>, res: Response) {
    try {
      const comment = await CommentModel.findById(req.params.id).populate('author', 'username');
      if (!comment) {
        return res.status(404).json({ message: '未找到评论' });
      }
      res.json(comment.toJSON());
    } catch (error) {
      res.status(400).json({ message: '获取评论失败', error: (error as Error).message });
    }
  },

  async updateComment(req: Request<{ id: string }, {}, UpdateCommentDto>, res: Response) {
    try {
      const comment = await CommentModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!comment) {
        return res.status(404).json({ message: '未找到评论' });
      }
      res.json(comment.toJSON());
    } catch (error) {
      res.status(400).json({ message: '更新评论失败', error: (error as Error).message });
    }
  },

  async deleteComment(req: Request<{ id: string }>, res: Response) {
    try {
      const comment = await CommentModel.findByIdAndDelete(req.params.id);
      if (!comment) {
        return res.status(404).json({ message: '未找到评论' });
      }
      
      // 更新帖子的评论数
      await PostModel.findByIdAndUpdate(comment.post, { $inc: { comments: -1 } });
      
      res.json({ message: '评论删除成功' });
    } catch (error) {
      res.status(400).json({ message: '删除评论失败', error: (error as Error).message });
    }
  },

  async getCommentsByPost(req: Request<{ postId: string }>, res: Response) {
    try {
      const comments = await CommentModel.find({ post: req.params.postId })
        .populate('author', 'username')
        .sort({ createdAt: -1 });
      res.json(comments.map(comment => comment.toJSON()));
    } catch (error) {
      res.status(400).json({ message: '获取帖子评论列表失败', error: (error as Error).message });
    }
  }
};