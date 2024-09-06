const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Ensure the data directory exists
const dataDir = path.resolve(__dirname, '../data');
if (!fs.existsSync(dataDir)){
    fs.mkdirSync(dataDir);
}

const dbPath = path.join(dataDir, 'database.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database: ' + err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS customers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        phone_number TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        address TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS addresses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_id INTEGER NOT NULL,
        address TEXT NOT NULL,
        is_primary BOOLEAN DEFAULT 0,
        FOREIGN KEY(customer_id) REFERENCES customers(id)
    )`);
});

module.exports = db;
