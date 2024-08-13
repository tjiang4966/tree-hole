import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { connectDB } from './config/database';
import routes from './routes';
import { swaggerSpec } from './config/swagger';

const app = express();

connectDB();

app.use(express.json());

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api', routes);

// 错误处理中间件
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

export default app;