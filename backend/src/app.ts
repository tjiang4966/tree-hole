// src/app.ts
import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes';
import acornBoxRoutes from './routes/acornBoxRoutes';
import replyRoutes from './routes/replyRoutes';
import { errorHandler } from './middlewares/errorHandler';
import { AppError } from './utils/errors';
import { swaggerUi, specs } from './swagger';
import { connectDB, disconnectDB } from './config/database';

dotenv.config();

const app = express();

// 中间件
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// 数据库连接
connectDB();

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

const PORT = process.env.NODE_ENV === 'test' ? process.env.TEST_PORT : process.env.PORT;
const appServer = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Close Server
const closeServer = async () => {
  await appServer.close();
  await disconnectDB();
}

export default app;
export { closeServer };