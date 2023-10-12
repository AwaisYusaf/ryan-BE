import mysql from 'mysql2';

import { Sequelize } from 'sequelize';

const sequelize = new Sequelize("mysql-db", "82usrqbe976ncbox4fry", "pscale_pw_JN9ydTVi9BwVQhDO07wEBvOHdJ7k13o2KVLdIy2A9mo",
    {
        dialect: 'mysql',
        host: 'aws.connect.psdb.cloud',
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