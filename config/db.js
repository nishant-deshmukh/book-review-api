// config/db.js
const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false, // optional: disables SQL logging in console
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ MySQL connected!');
  } catch (err) {
    console.error('❌ Unable to connect to DB:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
module.exports.sequelize = sequelize;
