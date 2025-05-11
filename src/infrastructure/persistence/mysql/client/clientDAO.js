const BaseDAO = require("../baseDAO");

const {
  DatabaseConnectionError,
  DatabaseQueryError,
  UserNotFoundError,
  ClientNotFoundError,
  AlreadyExistsError,
  ValidationError,
} = require("../../../../domain/errors");

class ClientDAO extends BaseDAO {
  async createSchema() {
    await this.createDatabaseSchemaIfNotExists();
  }

  handleError(error, connection, customMessage = "Database operation failed") {
    if (
      error instanceof UserNotFoundError ||
      error instanceof ClientNotFoundError ||
      error instanceof AlreadyExistsError
    ) {
      throw error;
    }
    if (!connection || error?.code === "ECONNREFUSED") {
      throw new DatabaseConnectionError("Error connecting to the database");
    }
    throw new DatabaseQueryError(`${customMessage}: ${error.message || ""}`);
  }

  async getConnectionWithSchema() {
    await this.createSchema();
    return this.pool.getConnection();
  }

  async checkIfUserOwnsClient(clientId, userId) {
    let connection;
    try {
      connection = await this.getConnectionWithSchema();
      const [rows] = await connection.query(
        "SELECT * FROM clients WHERE id = ? AND user_id = ?",
        [clientId, userId]
      );
      if (rows.length === 0) {
        throw new UserNotFoundError("User does not own this client");
      }
      return rows[0];
    } catch (error) {
      this.handleError(error, connection);
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }

  async checkIfClientExists(CIF, userId) {
    let connection;
    try {
      connection = await this.getConnectionWithSchema();
      const [rows] = await connection.query(
        "SELECT * FROM clients WHERE cif = ? AND user_id = ?",
        [CIF, userId]
      );
      if (rows.length > 0) {
        throw new AlreadyExistsError(
          "This client already exists for this user"
        );
      }
    } catch (error) {
      this.handleError(error, connection);
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }

  async create(client) {
    let connection;
    try {
      connection = await this.getConnectionWithSchema();
      await this.checkIfClientExists(client.CIF, client.userId);
      const [result] = await connection.query(
        "INSERT INTO clients (name, cif, address, user_id) VALUES (?, ?, ?, ?)",
        [client.name, client.CIF, client.address, client.userId]
      );
      if (result.affectedRows === 0) {
        throw new DatabaseQueryError("Failed to create client");
      }
      return await this.getById(result.insertId);
    } catch (error) {
      this.handleError(error, connection);
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }

  async getAll(userId) {
    let connection;
    try {
      connection = await this.getConnectionWithSchema();
      const [rows] = await connection.query(
        "SELECT * FROM clients WHERE user_id = ?",
        [userId]
      );
      return rows;
    } catch (error) {
      this.handleError(error, connection);
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }

  async update(client) {
    let connection;
    try {
      connection = await this.getConnectionWithSchema();
      const [result] = await connection.query(
        "UPDATE clients SET name = ?, address = ? WHERE cif = ? AND deleted = 0",
        [client.name, client.address, client.CIF]
      );
      if (result.affectedRows === 0) {
        throw new ClientNotFoundError("Client not found by CIF");
      }
      return await this.getByCIF(client.CIF);
    } catch (error) {
      this.handleError(error, connection);
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }

  async getById(id) {
    let connection;
    try {
      connection = await this.getConnectionWithSchema();
      const [rows] = await connection.query(
        "SELECT * FROM clients WHERE id = ?",
        [id]
      );
      if (rows.length === 0) {
        throw new ClientNotFoundError("Client not found by ID");
      }
      return rows[0];
    } catch (error) {
      this.handleError(error, connection);
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }

  async getByCIF(cif) {
    let connection;
    try {
      connection = await this.getConnectionWithSchema();
      const [rows] = await connection.query(
        "SELECT * FROM clients WHERE cif = ?",
        [cif]
      );
      if (rows.length === 0) {
        throw new ClientNotFoundError("Client not found by CIF");
      }
      return rows[0];
    } catch (error) {
      this.handleError(error, connection);
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }

  async softDelete(id) {
    let connection;
    try {
      connection = await this.getConnectionWithSchema();
      const [result] = await connection.query(
        "UPDATE clients SET deleted = 1 WHERE id = ?",
        [id]
      );
      if (result.affectedRows === 0) {
        throw new ClientNotFoundError("Client not found");
      }
    } catch (error) {
      this.handleError(error, connection);
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }

  async hardDelete(id) {
    let connection;
    try {
      connection = await this.getConnectionWithSchema();
      const [result] = await connection.query(
        "UPDATE clients SET deleted = 2, name = NULL, cif = NULL, address = NULL  WHERE id = ?",
        [id]
      );
      if (result.affectedRows === 0) {
        throw new ClientNotFoundError("Client not found");
      }
    } catch (error) {
      this.handleError(error, connection);
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }

  async getDeletedClientById(id) {
    let connection;
    try {
      connection = await this.getConnectionWithSchema();
      const [rows] = await connection.query(
        "SELECT * FROM clients WHERE id = ? AND deleted = 1",
        [id]
      );
      if (rows.length === 0) {
        throw new ClientNotFoundError(
          "Client not found, hard deleted, not deleted or not existing"
        );
      }
      return rows[0];
    } catch (error) {
      this.handleError(error, connection);
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }

  async restore(client) {
    let connection;
    try {
      connection = await this.getConnectionWithSchema();
      const [result] = await connection.query(
        "UPDATE clients SET deleted = 0 WHERE id = ?",
        [client.id]
      );
      if (result.affectedRows === 0) {
        throw new ClientNotFoundError("Client not found");
      }
    } catch (error) {
      this.handleError(error, connection);
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }

  async getDeliveryNoteByClientId(clientId) {
    let connection;
    try {
      connection = await this.getConnectionWithSchema();
      const [rows] = await connection.query(
        "SELECT * FROM delivery_notes WHERE client_id = ?",
        [clientId]
      );
      if (rows.length > 0) {
        throw new ValidationError("Client has delivery notes");
      }
    } catch (error) {
      this.handleError(error, connection);
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }
}

module.exports = new ClientDAO();
