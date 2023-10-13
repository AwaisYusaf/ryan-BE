import mysql from 'mysql2';
import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';

dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE_NAME as string, process.env.DATABASE_USERNAME as string, process.env.DATABASE_PASSWORD as string,
    {
        dialect: 'mysql',
        host: process.env.DATABASE_HOST,
        dialectOptions: {
            ssl: {
                rejectUnauthorized: true,
            }
        }
    });

(async () => {
    try {
        await sequelize.authenticate();
        console.log('database connection successful');
    } catch (error) {
        console.log('database connection failed');
    }
})();

export { Sequelize, sequelize }