// src/app.ts
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes';
import acornBoxRoutes from './routes/acornBoxRoutes';
import replyRoutes from './routes/replyRoutes';
import { errorHandler } from './middlewares/errorHandler';
import { AppError } from './utils/errors';
import { swaggerUi, specs } from './swagger';

dotenv.config();

const app = express();

// 中间件
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// 数据库连接
mongoose.connect(process.env.MONGODB_URI as string)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// 路由
app.use('/api/users', userRoutes);
app.use('/api/acornboxes', acornBoxRoutes);
app.use('/api/replies', replyRoutes);

// 处理未找到的路由
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// 错误处理中间件
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;