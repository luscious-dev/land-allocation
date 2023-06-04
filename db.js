const sql = require("mssql");

// Very important
// Make sure that the user in the database has password expiry set to false
const config = {
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  options: { trustServerCertificate: true }, // Clear the "self signed certificate" error
};

exports.conn = new sql.ConnectionPool(config);

exports.sql = sql;
