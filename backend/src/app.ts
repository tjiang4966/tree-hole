// backend/src/app.ts
import express from 'express';
import bodyParser from 'body-parser';
import { sequelize } from './config/database';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World！');
})


sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Unable to connect to the database:', err);
});
