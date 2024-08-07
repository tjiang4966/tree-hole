import express, { Express, Request, Response } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();

app.use(express.json());

const PORT: string | number = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI as string)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

app.get('/', (req: Request, res: Response) => {
  res.json({ message: "Welcome to Tree Hole API" });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));