// src/controllers/replyController.ts
import { Request, Response } from 'express';
import { Reply, AcornBox } from '../models';

export const createReply = async (req: Request, res: Response) => {
  try {
    const { content, acornBoxId } = req.body;
    const author = req.user.id;

    const acornBox = await AcornBox.findById(acornBoxId);

    if (!acornBox) {
      return res.status(404).json({ message: 'Acorn box not found' });
    }

    if (!acornBox.allowReplies) {
      return res.status(400).json({ message: 'This acorn box does not allow replies' });
    }

    const newReply = new Reply({
      content,
      acornBox: acornBoxId,
      author,
    });

    await newReply.save();

    res.status(201).json(newReply);
  } catch (error) {
    res.status(400).json({ message: 'Error creating reply', error });
  }
};

export const getReplies = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;

    const replies = await Reply.find({ author: userId })
      .populate('acornBox', 'content')
      .sort({ createdAt: -1 });

    res.json(replies);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching replies', error });
  }
};