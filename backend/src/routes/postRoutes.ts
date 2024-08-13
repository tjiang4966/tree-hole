// backend/src/routes/commentRoutes.ts

import express from 'express';
import { commentController } from '../controllers/commentController';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       required:
 *         - content
 *         - author
 *         - post
 *       properties:
 *         id:
 *           type: string
 *           description: 评论的自动生成ID
 *         content:
 *           type: string
 *           description: 评论内容
 *         author:
 *           type: string
 *           description: 创建评论的用户ID
 *         post:
 *           type: string
 *           description: 评论所属帖子的ID
 *         likes:
 *           type: number
 *           description: 评论的点赞数
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: 评论创建时间
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: 评论最后更新时间
 */

/**
 * @swagger
 * /api/comments:
 *   post:
 *     summary: 创建新评论
 *     tags: [评论]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Comment'
 *     responses:
 *       201:
 *         description: 评论创建成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       400:
 *         description: 请求错误
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 无效的帖子 / 创建评论失败
 */
router.post('/', commentController.createComment);

/**
 * @swagger
 * /api/comments/{id}:
 *   get:
 *     summary: 通过ID获取评论
 *     tags: [评论]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: 评论ID
 *     responses:
 *       200:
 *         description: 成功获取评论
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       404:
 *         description: 未找到评论
 *       400:
 *         description: 请求错误
 */
router.get('/:id', commentController.getComment);

/**
 * @swagger
 * /api/comments/{id}:
 *   put:
 *     summary: 更新评论
 *     tags: [评论]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: 评论ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Comment'
 *     responses:
 *       200:
 *         description: 评论更新成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       404:
 *         description: 未找到评论
 *       400:
 *         description: 请求错误
 */
router.put('/:id', commentController.updateComment);

/**
 * @swagger
 * /api/comments/{id}:
 *   delete:
 *     summary: 删除评论
 *     tags: [评论]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: 评论ID
 *     responses:
 *       200:
 *         description: 评论删除成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 评论删除成功
 *       404:
 *         description: 未找到评论
 *       400:
 *         description: 请求错误
 */
router.delete('/:id', commentController.deleteComment);

/**
 * @swagger
 * /api/posts/{postId}/comments:
 *   get:
 *     summary: 获取指定帖子的所有评论
 *     tags: [评论]
 *     parameters:
 *       - in: path
 *         name: postId
 *         schema:
 *           type: string
 *         required: true
 *         description: 帖子ID
 *     responses:
 *       200:
 *         description: 成功获取帖子的评论列表
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 *       400:
 *         description: 请求错误
 */
router.get('/posts/:postId/comments', commentController.getCommentsByPost);

export default router;