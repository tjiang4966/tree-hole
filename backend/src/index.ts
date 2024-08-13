import { connectDB } from './config/database';
import app from './app';

const port = process.env.PORT || 3000;

connectDB();

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`Swagger documentation is available at http://localhost:${port}/api-docs`);
});