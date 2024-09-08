const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./user');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS user(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email VARCHAR,
      name VARCHAR,
      lastName VARCHAR
    )
  `);
});

module.exports = db;