// src/controllers/acornBoxController.ts
import { Request, Response } from 'express';
import { AcornBox } from '../models';

export const createAcornBox = async (req: Request, res: Response) => {
  try {
    const { content, allowReplies } = req.body;
    const author = req.user.id; // 假设我们已经通过中间件设置了 req.user

    const newAcornBox = new AcornBox({
      content,
      author,
      allowReplies,
      anonymousId: generateAnonymousId(), // 需要实现这个函数
    });

    await newAcornBox.save();

    res.status(201).json(newAcornBox);
  } catch (error) {
    res.status(400).json({ message: 'Error creating acorn box', error });
  }
};

export const getRandomAcornBox = async (req: Request, res: Response) => {
  try {
    const randomAcornBox = await AcornBox.aggregate([
      { $match: { status: 'available' } },
      { $sample: { size: 1 } }
    ]);

    if (randomAcornBox.length === 0) {
      return res.status(404).json({ message: 'No available acorn boxes' });
    }

    res.json(randomAcornBox[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching random acorn box', error });
  }
};

export const openAcornBox = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const acornBox = await AcornBox.findById(id);

    if (!acornBox) {
      return res.status(404).json({ message: 'Acorn box not found' });
    }

    if (acornBox.status !== 'available') {
      return res.status(400).json({ message: 'Acorn box is not available' });
    }

    acornBox.status = 'opened';
    acornBox.openedBy = userId;
    acornBox.openedAt = new Date();

    await acornBox.save();

    res.json(acornBox);
  } catch (error) {
    res.status(500).json({ message: 'Error opening acorn box', error });
  }
};

function generateAnonymousId() {
  // 实现生成匿名ID的逻辑
  return 'anon_' + Math.random().toString(36).substr(2, 9);
}