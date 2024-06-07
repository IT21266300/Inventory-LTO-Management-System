// db.js
import mysql from 'mysql2';

const db = mysql.createConnection({
  host: "localhost",
  user: 'root',
  password: '1234',
  database: 'lto_db'
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed: ' + err.stack);
    return;
  }
  console.log('Connected to database.');
});

export default db;
