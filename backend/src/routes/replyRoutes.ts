// src/routes/replyRoutes.ts
import express from 'express';
import { createReply, getReplies } from '../controllers';
import { auth } from '../middlewares/auth';

const router = express.Router();

router.use(auth);

router.post('/', createReply);
router.get('/received', getReplies);

export default router;