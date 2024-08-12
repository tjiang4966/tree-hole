// backend/src/routes/index.ts

import express from 'express';
import userRoutes from './userRoutes';
import postRoutes from './postRoutes';
import commentRoutes from './commentRoutes';

const router = express.Router();

router.use('/users', userRoutes);
router.use('/posts', postRoutes);
router.use('/comments', commentRoutes);

// 添加这个特殊路由来处理获取帖子评论
router.use('/posts/:postId/comments', commentRoutes);

export default router;