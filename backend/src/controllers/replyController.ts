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

/**
 * 导出一个异步函数，用于获取回复信息
 * @param req 
 * @param res 
 */
export const getReplies = async (req: Request, res: Response) => {
  try {
    // 获取请求中的用户ID
    const userId = req.user.id;

    // 查询作者为当前用户的回复信息，并按照创建时间倒序排序
    const replies = await Reply.find({ author: userId })
      .populate('acornBox', 'content')
      .sort({ createdAt: -1 });

    // 将查询到的回复信息以 JSON 格式返回给客户端
    res.json(replies);
  } catch (error) {
    // 如果出现错误，返回一个包含错误信息的 JSON 响应
    res.status(500).json({ message: 'Error fetching replies', error });
  }
};

/**
 * 
 * @param req 
 * @param res 
 */
export const getReceivedReplies = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;  // Assuming the auth middleware attaches the user to the request
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const skip = (page - 1) * limit;

    // First, get all AcornBoxes created by the user
    const userAcornBoxes = await AcornBox.find({ author: userId }).select('_id');
    const userAcornBoxIds = userAcornBoxes.map(box => box._id);

    // Then, get replies for these AcornBoxes
    const replies = await Reply.find({ acornBox: { $in: userAcornBoxIds } })
      .sort({ createdAt: -1 })  // Sort by creation date, newest first
      .skip(skip)
      .limit(limit)
      .populate('acornBox', 'content anonymousId')  // Populate with minimal AcornBox info
      .populate('author', 'username');  // Populate with minimal author info

    const totalReplies = await Reply.countDocuments({ acornBox: { $in: userAcornBoxIds } });
    const totalPages = Math.ceil(totalReplies / limit);

    // Update isRead status for fetched replies
    const replyIds = replies.map(reply => reply._id);
    await Reply.updateMany(
      { _id: { $in: replyIds }, isRead: false },
      { $set: { isRead: true } }
    );

    res.status(200).json({
      replies,
      currentPage: page,
      totalPages,
      totalReplies
    });
  } catch (error) {
    console.error('Error in getReceivedReplies:', error);
    res.status(500).json({ message: 'An error occurred while fetching received replies' });
  }
};
