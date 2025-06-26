// db.js 
const mysql = require("mysql2/promise");
const util = require('util');
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "__Piyush_91_", 
  database: "dummy",
  waitForConnections: true,
  connectionLimit: 10,  // Limits concurrent connections
  queueLimit: 0,
});

// db.query = util.promisify(db.query); 


db.getConnection()
  .then((connection) => {
    console.log("Connected to MySQL");
    connection.release(); // Release the connection back to the pool
  })
  .catch((err) => {
    console.error("Error connecting to MySQL:", err);
  });

module.exports = db;
