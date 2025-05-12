const BaseDAO = require("../baseDAO");

const {
  DatabaseConnectionError,
  DatabaseQueryError,
  ProjectNotFoundError,
  AlreadyExistsError,
} = require("../../../../domain/errors");

class DeliveryNoteDAO extends BaseDAO {
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
    if (
      error instanceof ProjectNotFoundError ||
      error instanceof AlreadyExistsError
    ) {
      throw error;
    }
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

  async getById(id) {
    let connection;
    try {
      connection = await this.getConnectionWithSchema();
      const [rows] = await connection.query(
        `SELECT * FROM delivery_notes WHERE id = ?`,
        [id]
      );
      if (rows.length === 0) {
        throw new Error("Delivery note not found");
      }
      return rows[0];
    } catch (error) {
      this.handleError(error, connection, "Failed to get delivery note");
      throw error;
    } finally {
      if (connection) connection.release();
    }
  }

  async checkIfProjectBelongsToClientBelongingToUser(
    userId,
    clientId,
    projectId
  ) {
    let connection;
    try {
      connection = await this.getConnectionWithSchema();
      const [rows] = await connection.query(
        `SELECT * FROM projects WHERE id = ? AND client_id = ? AND user_id = ?`,
        [projectId, clientId, userId]
      );
      if (rows.length === 0) {
        throw new ProjectNotFoundError(
          "Project does not belong to the client or user"
        );
      }
      return rows[0];
    } catch (error) {
      this.handleError(error, connection, "Failed to check project ownership");
      throw error;
    } finally {
      if (connection) connection.release();
    }
  }

  async checkIfExists(
    userId,
    clientId,
    projectId,
    format,
    material,
    hours,
    description
  ) {
    let connection;
    try {
      connection = await this.getConnectionWithSchema();
      const [rows] = await connection.query(
        `SELECT * FROM delivery_notes WHERE user_id = ? AND client_id = ? AND project_id = ? AND format = ? AND material = ? AND hours = ? AND description = ?`,
        [userId, clientId, projectId, format, material, hours, description]
      );
      if (rows.length > 0) {
        throw new AlreadyExistsError("Delivery note already exists");
      }
      return rows[0];
    } catch (error) {
      this.handleError(
        error,
        connection,
        "Failed to check delivery note existence"
      );
      throw error;
    } finally {
      if (connection) connection.release();
    }
  }

  /**
   * Creates a new delivery note.
   */
  async create(deliveryNote) {
    let connection;
    try {
      connection = await this.getConnectionWithSchema();
      const [result] = await connection.query(
        `INSERT INTO delivery_notes (user_id, client_id, project_id, format, material, hours, description, date)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          deliveryNote.userId,
          deliveryNote.clientId,
          deliveryNote.projectId,
          deliveryNote.format,
          deliveryNote.material,
          deliveryNote.hours,
          deliveryNote.description,
          deliveryNote.date,
        ]
      );
      return await this.getById(result.insertId);
    } catch (error) {
      this.handleError(error, connection, "Failed to create delivery note");
      throw error;
    } finally {
      if (connection) connection.release();
    }
  }
}

module.exports = new DeliveryNoteDAO();
