// backend/src/routes/commentRoutes.ts

import express from 'express';
import { commentController } from '../controllers/commentController';

const router = express.Router();

router.post('/', commentController.createComment);
router.get('/:id', commentController.getComment);
router.put('/:id', commentController.updateComment);
router.delete('/:id', commentController.deleteComment);
router.get('/posts/:postId/comments', commentController.getCommentsByPost);

export default router;