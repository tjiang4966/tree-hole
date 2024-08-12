// backend/src/routes/postRoutes.ts

import express from 'express';
import { postController } from '../controllers/postController';

const router = express.Router();

router.post('/', postController.createPost);
router.get('/', postController.getAllPosts);
router.get('/:id', postController.getPost);
router.put('/:id', postController.updatePost);
router.delete('/:id', postController.deletePost);

export default router;