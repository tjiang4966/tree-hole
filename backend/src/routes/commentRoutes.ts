// backend/src/routes/commentRoutes.ts

import express from 'express';
import { commentController } from '../controllers/commentController';
import { auth } from '../middleware/auth';

const router = express.Router();

/**
 * @swagger
 * /api/comments:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Create a new comment
 *     tags: [Comments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Comment'
 *     responses:
 *       201:
 *         description: The comment was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid post / 创建评论失败
 */
router.post('/', auth, commentController.createComment);

/**
 * @swagger
 * /api/comments/{id}:
 *   get:
 *     summary: Get a comment by id
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The comment id
 *     responses:
 *       200:
 *         description: The comment description by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       404:
 *         description: The comment was not found
 *       400:
 *         description: Bad request
 */
router.get('/:id', commentController.getComment);

/**
 * @swagger
 * /api/comments/{id}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     summary: Update a comment
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The comment id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Comment'
 *     responses:
 *       200:
 *         description: The comment was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       404:
 *         description: The comment was not found
 *       400:
 *         description: Bad request
 */
router.put('/:id', auth, commentController.updateComment);

/**
 * @swagger
 * /api/comments/{id}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     summary: Delete a comment
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The comment id
 *     responses:
 *       200:
 *         description: The comment was deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 评论删除成功
 *       404:
 *         description: The comment was not found
 *       400:
 *         description: Bad request
 */
router.delete('/:id', auth, commentController.deleteComment);

/**
 * @swagger
 * /api/posts/{postId}/comments:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get all comments for a specific post
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: postId
 *         schema:
 *           type: string
 *         required: true
 *         description: The post id
 *     responses:
 *       200:
 *         description: The list of comments for the post
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Bad request
 */
router.get('/posts/:postId/comments', auth, commentController.getCommentsByPost);

export default router;