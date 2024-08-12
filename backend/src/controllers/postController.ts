// backend/src/controllers/postController.ts

import { Request, Response } from 'express';
import { PostModel } from '../models/Post';
import { CreatePostDto, UpdatePostDto } from '@tree-hole/shared';

export const postController = {
  async createPost(req: Request<{}, {}, CreatePostDto>, res: Response) {
    try {
      const post = new PostModel(req.body);
      await post.save();
      res.status(201).json(post.toJSON());
    } catch (error) {
      res.status(400).json({ message: '创建帖子失败', error: (error as Error).message });
    }
  },

  async getPost(req: Request<{ id: string }>, res: Response) {
    try {
      const post = await PostModel.findById(req.params.id).populate('author', 'username');
      if (!post) {
        return res.status(404).json({ message: '未找到帖子' });
      }
      res.json(post.toJSON());
    } catch (error) {
      res.status(400).json({ message: '获取帖子失败', error: (error as Error).message });
    }
  },

  async updatePost(req: Request<{ id: string }, {}, UpdatePostDto>, res: Response) {
    try {
      const post = await PostModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!post) {
        return res.status(404).json({ message: '未找到帖子' });
      }
      res.json(post.toJSON());
    } catch (error) {
      res.status(400).json({ message: '更新帖子失败', error: (error as Error).message });
    }
  },

  async deletePost(req: Request<{ id: string }>, res: Response) {
    try {
      const post = await PostModel.findByIdAndDelete(req.params.id);
      if (!post) {
        return res.status(404).json({ message: '未找到帖子' });
      }
      res.json({ message: '帖子删除成功' });
    } catch (error) {
      res.status(400).json({ message: '删除帖子失败', error: (error as Error).message });
    }
  },

  async getAllPosts(req: Request, res: Response) {
    try {
      const posts = await PostModel.find().populate('author', 'username').sort({ createdAt: -1 });
      res.json(posts.map(post => post.toJSON()));
    } catch (error) {
      res.status(400).json({ message: '获取帖子列表失败', error: (error as Error).message });
    }
  }
};