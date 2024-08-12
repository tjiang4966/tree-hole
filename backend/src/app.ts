// backend/src/app.ts

import express from 'express';
import { connectDB } from './config/database';
import routes from './routes';

const app = express();

// 连接数据库
connectDB();

// 中间件
app.use(express.json());

// 路由
app.use('/api', routes);

// 错误处理中间件
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

export default app;