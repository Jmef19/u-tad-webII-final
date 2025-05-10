const BaseDAO = require("../baseDAO");

const {
  DatabaseConnectionError,
  DatabaseQueryError,
  ProjectNotFoundError,
  NotOwnedProjectError,
} = require("../../../../domain/errors");

class ProjectDAO extends BaseDAO {
  async createSchema() {
    await this.createDatabaseSchemaIfNotExists();
  }

  handleError(error, connection, customMessage = "Database operation failed") {
    if (
      error instanceof ProjectNotFoundError ||
      error instanceof NotOwnedProjectError
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

  async checkIfUserOwnsProject(userId, projectId, clientId) {
    let connection;
    try {
      connection = await this.getConnectionWithSchema();
      const [rows] = await connection.query(
        "SELECT * FROM projects WHERE id = ? AND user_id = ? AND client_id = ?",
        [projectId, userId, clientId]
      );
      if (rows.length === 0) {
        throw new NotOwnedProjectError(
          "User or client does not own this project"
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

  async create(project) {
    let connection;
    try {
      connection = await this.getConnectionWithSchema();
      const [result] = await connection.query(
        "INSERT INTO projects (name, email, address, client_id, user_id) VALUES (?, ?, ?, ?, ?)",
        [
          project.projectName,
          project.email,
          project.address,
          project.clientId,
          project.userId,
        ]
      );
      return { ...project, id: result.insertId };
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
        "SELECT * FROM projects WHERE id = ?",
        [id]
      );
      if (rows.length === 0) {
        throw new ProjectNotFoundError("Project not found");
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

  async update(project) {
    let connection;
    try {
      connection = await this.getConnectionWithSchema();
      const [result] = await connection.query(
        "UPDATE projects SET name = ?, email = ?, address = ? WHERE id = ?",
        [project.projectName, project.email, project.address, project.id]
      );
      if (result.affectedRows === 0) {
        throw new ProjectNotFoundError("Project not found");
      }
      return project;
    } catch (error) {
      this.handleError(error, connection);
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }

  async getAll(userId, clientId) {
    let connection;
    try {
      connection = await this.getConnectionWithSchema();
      const [rows] = await connection.query(
        "SELECT * FROM projects WHERE user_id = ? AND client_id = ?",
        [userId, clientId]
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

  async softDelete(id) {
    let connection;
    try {
      connection = await this.getConnectionWithSchema();
      const [result] = await connection.query(
        "UPDATE projects SET deleted = 1 WHERE id = ?",
        [id]
      );
      if (result.affectedRows === 0) {
        throw new ProjectNotFoundError("Project not found");
      }
      return result;
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
        "UPDATE projects SET deleted = 2, name = NULL, email = NULL, address = NULL, WHERE id = ?",
        [id]
      );
      if (result.affectedRows === 0) {
        throw new ProjectNotFoundError("Project not found");
      }
      return result;
    } catch (error) {
      this.handleError(error, connection);
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }

  async getDeletedProjectById(id) {
    let connection;
    try {
      connection = await this.getConnectionWithSchema();
      const [rows] = await connection.query(
        "SELECT * FROM projects WHERE id = ? AND deleted = 1",
        [id]
      );
      if (rows.length === 0) {
        throw new ProjectNotFoundError("Project not found");
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

  async restore(id) {
    let connection;
    try {
      connection = await this.getConnectionWithSchema();
      const [result] = await connection.query(
        "UPDATE projects SET deleted = 0 WHERE id = ?",
        [id]
      );
      if (result.affectedRows === 0) {
        throw new ProjectNotFoundError("Project not found");
      }
      return result;
    } catch (error) {
      this.handleError(error, connection);
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }
}

module.exports = new ProjectDAO();
