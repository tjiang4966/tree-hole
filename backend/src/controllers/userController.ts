import validator from 'validator';
import { Request, Response } from 'express';
import { UserModel } from '../models/User';
import { CreateUserDto, UpdateUserDto } from '@tree-hole/shared';

export const userController = {
  async createUser(req: Request<{}, {}, CreateUserDto>, res: Response) {
    try {
      const { username, email, password } = req.body;

      // 验证电子邮件格式
      if (!validator.isEmail(email)) {
        return res.status(400).json({ message: '无效的电子邮件格式' });
      }

      // 验证密码强度（这里假设密码至少需要8个字符）
      if (!validator.isLength(password, { min: 8 })) {
        return res.status(400).json({ message: '密码必须至少包含8个字符' });
      }

      const user = new UserModel({ username, email, password });
      await user.save();
      res.status(201).json(user.toJSON());
    } catch (error) {
      if ((error as any).code === 11000) {
        // MongoDB 重复键错误
        return res.status(400).json({ message: '用户名或电子邮件已存在' });
      }
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
      const { email, password } = req.body;

      // 如果提供了电子邮件，验证其格式
      if (email && !validator.isEmail(email)) {
        return res.status(400).json({ message: '无效的电子邮件格式' });
      }

      // 如果提供了密码，验证其强度
      if (password && !validator.isLength(password, { min: 8 })) {
        return res.status(400).json({ message: '密码必须至少包含8个字符' });
      }

      const user = await UserModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!user) {
        return res.status(404).json({ message: '未找到用户' });
      }
      res.json(user.toJSON());
    } catch (error) {
      if ((error as any).code === 11000) {
        // MongoDB 重复键错误
        return res.status(400).json({ message: '用户名或电子邮件已存在' });
      }
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