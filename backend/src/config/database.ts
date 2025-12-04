import { Sequelize } from 'sequelize';
import 'dotenv/config';

export const sequelize = new Sequelize(
  process.env.DB_NAME as string,
  process.env.DB_USER as string,
  process.env.DB_PASSWORD as string,
  {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 5432,
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: process.env.DB_SSL === 'true' ? {
        require: true,
        rejectUnauthorized: false
      } : false,
    },
  }
);

sequelize.authenticate()
  .then(() => {
    console.log('✅ Successfully connected to PostgreSQL via Sequelize');
  })
  .catch((err: Error) => {
    console.error('❌ Sequelize connection failed:', err);
  });

export default sequelize;
