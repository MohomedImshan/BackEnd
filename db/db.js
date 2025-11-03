import mysql from 'mysql';
import dotenv from 'dotenv';

dotenv.config();

const db = mysql.createConnection({
  host: process.env.DB_HOST||localhost,
  user: process.env.DB_USER||root,
  password: process.env.DB_PASS||'',
  database: process.env.DB_NAME||spare-parts-management-system
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed: " + err.message);
  } else {
    console.log("Connected to MySQL database");
  }
});

export default db;
