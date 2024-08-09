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

export const getUserAcornBoxes = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;  // Assuming the auth middleware attaches the user to the request
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const skip = (page - 1) * limit;

    const acornBoxes = await AcornBox.find({ author: userId })
      .sort({ createdAt: -1 })  // Sort by creation date, newest first
      .skip(skip)
      .limit(limit);

    const totalAcornBoxes = await AcornBox.countDocuments({ author: userId });
    const totalPages = Math.ceil(totalAcornBoxes / limit);

    res.status(200).json({
      acornBoxes,
      currentPage: page,
      totalPages,
      totalAcornBoxes
    });
  } catch (error) {
    console.error('Error in getUserAcornBoxes:', error);
    res.status(500).json({ message: 'An error occurred while fetching user AcornBoxes' });
  }
};

function generateAnonymousId() {
  // 实现生成匿名ID的逻辑
  return 'anon_' + Math.random().toString(36).substr(2, 9);
}