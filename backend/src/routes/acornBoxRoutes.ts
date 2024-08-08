// src/routes/acornBoxRoutes.ts
import express from 'express';
import { createAcornBox, getRandomAcornBox, openAcornBox } from '../controllers/';
import { auth } from '../middlewares/auth';

const router = express.Router();

router.use(auth);

router.post('/', createAcornBox);
router.get('/random', getRandomAcornBox);
router.post('/:id/open', openAcornBox);

export default router;
