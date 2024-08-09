// src/routes/replyRoutes.ts
import express from 'express';
import { createReply, getReceivedReplies, getReplies } from '../controllers';
import { auth } from '../middlewares/auth';

const router = express.Router();

router.use(auth);

/**
 * @swagger
 * tags:
 *   name: Replies
 *   description: Reply management
 */

/**
 * @swagger
 * /api/replies:
 *   post:
 *     summary: Create a new reply
 *     tags: [Replies]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *               - acornBoxId
 *             properties:
 *               content:
 *                 type: string
 *               acornBoxId:
 *                 type: string
 *     responses:
 *       201:
 *         description: The created reply
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reply'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: AcornBox not found
 */
router.post('/', createReply);

/**
 * @swagger
 * /api/replies:
 *   get:
 *     summary: Get user's replies
 *     tags: [Replies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: The page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: The number of items per page
 *     responses:
 *       200:
 *         description: A list of user's replies
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 replies:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Reply'
 *                 totalPages:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 *       401:
 *         description: Unauthorized
 */
router.get('/', auth, getReplies);

/**
 * @swagger
 * /api/replies/received:
 *   get:
 *     summary: Get replies received by the user
 *     tags: [Replies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: The page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: The number of items per page
 *     responses:
 *       200:
 *         description: A list of replies received by the user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 replies:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Reply'
 *                 totalPages:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 *       401:
 *         description: Unauthorized
 */
router.get('/received', auth, getReceivedReplies);

export default router;