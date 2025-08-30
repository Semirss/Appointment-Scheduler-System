import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const mySqlConnection = await mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB
});

console.log('MySQL database connected');

export default mySqlConnection;
