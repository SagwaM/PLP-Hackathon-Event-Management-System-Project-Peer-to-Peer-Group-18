// db.js
const mysql = require('mysql');

// MySQL connection setup
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '@Bts2109*',
  database: 'event_management'
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err.stack);
    return;
  }
  console.log('Connected to MySQL');
});

module.exports = db;
