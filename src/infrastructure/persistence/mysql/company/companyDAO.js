const BaseDAO = require("../baseDAO");
const {
  DatabaseConnectionError,
  DatabaseQueryError,
} = require("../../../../domain/errors");

class CompanyDAO extends BaseDAO {
  /**
   * Ensures the database schema exists before using it.
   */
  async createSchema() {
    await this.createDatabaseSchemaIfNotExists();
  }

  /**
   * Centralized database error handler.
   */
  handleError(error, connection, customMessage = "Database operation failed") {
    if (!connection || error?.code === "ECONNREFUSED") {
      throw new DatabaseConnectionError("Error connecting to the database");
    }
    throw new DatabaseQueryError(`${customMessage}: ${error.message || ""}`);
  }

  /**
   * Gets a DB connection and ensures schema exists.
   */
  async getConnectionWithSchema() {
    await this.createSchema();
    return this.pool.getConnection();
  }

  /**
   * Updates company information.
   */
  async updateCompany({ name, CIF, address }) {
    let connection;
    try {
      connection = await this.getConnectionWithSchema();
      await connection.query(
        `INSERT INTO companies (name, CIF, address)
         VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE
           name = VALUES(name),
           address = VALUES(address)`,
        [name, CIF, address]
      );
      const [company] = await connection.query(
        `SELECT id, name, CIF, address FROM companies WHERE CIF = ?`,
        [CIF]
      );
      return company;
    } catch (error) {
      this.handleError(error, connection, "Failed to insert or update company");
      throw error;
    } finally {
      if (connection) connection.release();
    }
  }

  /**
   * Handles user deletion by removing the company association.
   */
  async handleUserDeletion(companyId) {
    let connection;
    try {
      connection = await this.getConnectionWithSchema();
      await connection.query(
        `UPDATE companies SET name = NULL, cif = NULL, address = NULL WHERE id = ?`,
        [companyId]
      );
      return true;
    } catch (error) {
      this.handleError(error, connection, "Failed to handle company deletion");
      throw error;
    } finally {
      if (connection) connection.release();
    }
  }
}

module.exports = new CompanyDAO();
