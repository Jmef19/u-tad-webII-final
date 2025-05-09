const pool = require("../../../config/mysql");

const {
  DatabaseConnectionError,
  DatabaseQueryError,
} = require("../../../domain/errors");

class BaseDAO {
  constructor() {
    this.pool = pool;
  }

  async createDatabaseSchemaIfNotExists() {
    let connection;
    try {
      connection = await this.pool.getConnection();
      // Create companies table
      await connection.query(`
        CREATE TABLE IF NOT EXISTS companies (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255),
          cif CHAR(9) UNIQUE,
          address VARCHAR(255)
        )
      `);

      // Create users table
      await connection.query(`
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          email VARCHAR(255),
          password CHAR(60),
          validation_code CHAR(6),
          number_of_attempts INT DEFAULT 0,
          status ENUM('validated', 'not_validated') DEFAULT 'not_validated',
          deleted INT DEFAULT 0,
          role ENUM('personal', 'company') DEFAULT 'personal',
          profile_url VARCHAR(2083),
          profile_mem_type VARCHAR(10),
          profile_img_size INT,
          name VARCHAR(100),
          surname VARCHAR(100),
          nif CHAR(9) UNIQUE,
          company_id INT,
          FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE SET NULL
        )
      `);
    } catch (error) {
      if (!connection || error?.code === "ECONNREFUSED") {
        throw new DatabaseConnectionError("Error connecting to database");
      }
      throw new DatabaseQueryError(error.message || "Error executing query");
    } finally {
      if (connection) connection.release();
    }
  }
}

module.exports = BaseDAO;
