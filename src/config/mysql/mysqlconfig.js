const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  uri: process.env.MYSQL_URI,
  connectionLimit: 10,
});

module.exports = pool;
