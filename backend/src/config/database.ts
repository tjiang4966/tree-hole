// backend/src/config/database.ts
import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(
    process.env.MYSQL_DATABASE as string,
    process.env.MYSQL_USER as string,
    process.env.MYSQL_PASSWORD as string,
    {
        host: process.env.MYSQL_HOST as string,
        dialect: 'mysql'
    }
);

export { sequelize };
