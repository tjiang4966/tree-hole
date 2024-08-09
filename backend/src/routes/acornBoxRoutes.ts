// src/routes/acornBoxRoutes.ts
import express from 'express';
import { createAcornBox, getRandomAcornBox, getUserAcornBoxes, openAcornBox } from '../controllers/';
import { auth } from '../middlewares/auth';

const router = express.Router();

router.use(auth);

/**
 * @swagger
 * tags:
 *   name: AcornBoxes
 *   description: AcornBox management
 */

/**
 * @swagger
 * /api/acornboxes:
 *   post:
 *     summary: Create a new AcornBox
 *     tags: [AcornBoxes]
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
 *             properties:
 *               content:
 *                 type: string
 *               allowReplies:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: The created AcornBox
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AcornBox'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post('/', createAcornBox);

/**
 * @swagger
 * /api/acornboxes/random:
 *   get:
 *     summary: Get a random AcornBox
 *     tags: [AcornBoxes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A random AcornBox
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AcornBox'
 *       404:
 *         description: No available AcornBoxes
 *       401:
 *         description: Unauthorized
 */
router.get('/random', getRandomAcornBox);
/**
 * @swagger
 * /api/acornboxes/{id}/open:
 *   post:
 *     summary: Open an AcornBox
 *     tags: [AcornBoxes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The AcornBox id
 *     responses:
 *       200:
 *         description: The opened AcornBox
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AcornBox'
 *       400:
 *         description: AcornBox is not available
 *       404:
 *         description: AcornBox not found
 *       401:
 *         description: Unauthorized
 */
router.post('/:id/open', openAcornBox);

/**
 * @swagger
 * /api/acornboxes/user:
 *   get:
 *     summary: Get user's AcornBoxes
 *     tags: [AcornBoxes]
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
 *         description: A list of user's AcornBoxes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 acornBoxes:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/AcornBox'
 *                 totalPages:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 *       401:
 *         description: Unauthorized
 */
router.get('/user', auth, getUserAcornBoxes);

export default router;
