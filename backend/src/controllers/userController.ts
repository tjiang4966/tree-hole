// backend/src/controllers/userController.ts

import { Request, Response } from 'express';
import { UserModel } from '../models/User';
import { CreateUserDto, UpdateUserDto } from '@tree-hole/shared';

export const userController = {
  async createUser(req: Request<{}, {}, CreateUserDto>, res: Response) {
    try {
      const user = new UserModel(req.body);
      await user.save();
      res.status(201).json(user.toJSON());
    } catch (error) {
      res.status(400).json({ message: '创建用户失败', error: (error as Error).message });
    }
  },

  async getUser(req: Request<{ id: string }>, res: Response) {
    try {
      const user = await UserModel.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: '未找到用户' });
      }
      res.json(user.toJSON());
    } catch (error) {
      res.status(400).json({ message: '获取用户信息失败', error: (error as Error).message });
    }
  },

  async updateUser(req: Request<{ id: string }, {}, UpdateUserDto>, res: Response) {
    try {
      const user = await UserModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!user) {
        return res.status(404).json({ message: '未找到用户' });
      }
      res.json(user.toJSON());
    } catch (error) {
      res.status(400).json({ message: '更新用户信息失败', error: (error as Error).message });
    }
  },

  async deleteUser(req: Request<{ id: string }>, res: Response) {
    try {
      const user = await UserModel.findByIdAndDelete(req.params.id);
      if (!user) {
        return res.status(404).json({ message: '未找到用户' });
      }
      res.json({ message: '用户删除成功' });
    } catch (error) {
      res.status(400).json({ message: '删除用户失败', error: (error as Error).message });
    }
  }
};