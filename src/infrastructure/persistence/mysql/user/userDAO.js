const BaseDAO = require("../baseDAO");
const {
  DatabaseConnectionError,
  DatabaseQueryError,
  UserNotFoundError,
} = require("../../../../domain/errors");

class UserDAO extends BaseDAO {
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
    if (error instanceof UserNotFoundError) {
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

  /**
   * Returns a validated user by email.
   */
  async findValidatedUserByEmail(email) {
    let connection;
    try {
      connection = await this.getConnectionWithSchema();
      const [result] = await connection.query(
        `SELECT * FROM users WHERE email = ? AND status = 'validated'`,
        [email]
      );
      return result[0];
    } catch (error) {
      this.handleError(
        error,
        connection,
        "Failed to find validated user by email"
      );
    } finally {
      if (connection) connection.release();
    }
  }

  /**
   * Finds a user by ID.
   */
  async selectUserById(id) {
    let connection;
    try {
      connection = await this.getConnectionWithSchema();
      const [result] = await connection.query(
        `SELECT * FROM users WHERE id = ? AND deleted = 0`,
        [id]
      );
      if (!result?.length) {
        throw new DatabaseQueryError("User not found by ID");
      }
      return result[0];
    } catch (error) {
      this.handleError(error, connection, "Failed to select user by ID");
    } finally {
      if (connection) connection.release();
    }
  }

  /**
   * Finds a user by email.
   */
  async selectUserByEmail(email) {
    let connection;
    try {
      connection = await this.getConnectionWithSchema();
      const [result] = await connection.query(
        `SELECT * FROM users WHERE email = ? AND deleted = 0`,
        [email]
      );
      if (!result?.length) {
        throw new UserNotFoundError("User not found by email");
      }
      return result[0];
    } catch (error) {
      this.handleError(error, connection, "Failed to select user by email");
    } finally {
      if (connection) connection.release();
    }
  }

  /**
   * Find a user by ID and get their company information.
   */
  async selectUserByIdWithCompany(id) {
    let connection;
    try {
      connection = await this.getConnectionWithSchema();
      const [result] = await connection.query(
        `SELECT * FROM users AS u LEFT JOIN companies AS c ON u.company_id = c.id 
        UNION 
        SELECT * FROM users AS u RIGHT JOIN companies AS c ON u.company_id = c.id;`,
        [id]
      );
      if (!result?.length) {
        throw new UserNotFoundError("User not found by ID with company info");
      }
      return result[0];
    } catch (error) {
      this.handleError(error, connection, "Failed to select user with company");
    } finally {
      if (connection) connection.release();
    }
  }

  /**
   * Registers a new user.
   */
  async userRegistration(user) {
    let connection;
    try {
      connection = await this.getConnectionWithSchema();
      const [results] = await connection.query(
        `INSERT INTO users (email, password, validation_code) VALUES (?, ?, ?)`,
        [user.email, user.password, user.validationCode]
      );
      return await this.selectUserById(results.insertId);
    } catch (error) {
      this.handleError(error, connection, "Failed to register user");
    } finally {
      if (connection) connection.release();
    }
  }

  /**
   * Check if the validation code passed is the same as the one in db
   */
  async checkValidationCode(userId, validationCode) {
    let connection;
    try {
      connection = await this.getConnectionWithSchema();
      const [result] = await connection.query(
        `SELECT * FROM users WHERE id = ? AND validation_code = ?`,
        [userId, validationCode]
      );
      if (!result?.length) {
        return null;
      }
      return result[0];
    } catch (error) {
      this.handleError(error, connection, "Failed to check validation code");
    } finally {
      if (connection) connection.release();
    }
  }

  /**
   * Validates a user's email with code and removes duplicates.
   */
  async codeValidation(userId) {
    let connection;
    try {
      connection = await this.getConnectionWithSchema();
      const [update] = await connection.query(
        `UPDATE users SET status = 'validated' WHERE id = ? AND status != 'validated'`,
        [userId]
      );
      if (update.affectedRows === 0) {
        throw new DatabaseQueryError(
          "No user updated – already validated or does not exist"
        );
      }
      const [emailResult] = await connection.query(
        `SELECT email FROM users WHERE id = ?`,
        [userId]
      );
      if (!emailResult?.length) {
        throw new DatabaseQueryError("User email not found after update");
      }
      const email = emailResult[0].email;

      // delete duplicates entries with the same email
      const [duplicates] = await connection.query(
        `SELECT id FROM users WHERE email = ? AND id != ?`,
        [email, userId]
      );
      if (!duplicates?.length) {
        return true;
      }
      // delete duplicates
      const [deleteResult] = await connection.query(
        `DELETE FROM users WHERE email = ? AND id != ?`,
        [email, userId]
      );
      if (deleteResult.affectedRows === 0) {
        throw new DatabaseQueryError("Failed to delete duplicate users");
      }
      return true;
    } catch (error) {
      this.handleError(error, connection, "Failed to validate user code");
    } finally {
      if (connection) connection.release();
    }
  }

  /**
   * Gets the validation code for a user by ID.
   */
  async getValidationCodeByUserId(id) {
    let connection;
    try {
      connection = await this.getConnectionWithSchema();
      const [results] = await connection.query(
        `SELECT validation_code FROM users WHERE id = ? AND deleted = 0`,
        [id]
      );
      if (!results.length) {
        throw new DatabaseQueryError("No validation code found for user");
      }
      return results[0].validation_code;
    } catch (error) {
      this.handleError(error, connection, "Failed to retrieve validation code");
    } finally {
      if (connection) connection.release();
    }
  }

  /**
   * Gets the number of login attempts for a user.
   */
  async getNumberOfAttempts(userId) {
    let connection;
    try {
      connection = await this.getConnectionWithSchema();
      const [results] = await connection.query(
        `SELECT number_of_attempts FROM users WHERE id = ? AND deleted = 0`,
        [userId]
      );
      if (!results.length) {
        throw new DatabaseQueryError("No attempts found for user");
      }
      return results[0].number_of_attempts;
    } catch (error) {
      this.handleError(
        error,
        connection,
        "Failed to retrieve number of attempts"
      );
    } finally {
      if (connection) connection.release();
    }
  }

  /**
   * Updates the number of login attempts for a user.
   */
  async updateNumberOfAttempts(userId, numberOfAttempts) {
    let connection;
    try {
      connection = await this.getConnectionWithSchema();
      const [results] = await connection.query(
        `UPDATE users SET number_of_attempts = ? WHERE id = ? AND deleted = 0`,
        [numberOfAttempts, userId]
      );
      if (results.affectedRows === 0) {
        throw new DatabaseQueryError("Failed to update number of attempts");
      }
      return true;
    } catch (error) {
      this.handleError(error, connection, "Failed to update attempts");
    } finally {
      if (connection) connection.release();
    }
  }

  /**
   * Updates the profile image metadata for a user.
   */
  async updateProfileImage(userId, { path, mimetype, size }) {
    let connection;
    try {
      connection = await this.getConnectionWithSchema();
      const [result] = await connection.query(
        `UPDATE users 
         SET profile_url = ?, profile_mem_type = ?, profile_img_size = ?
         WHERE id = ? AND deleted = 0 AND status = 'validated'`,
        [path, mimetype, size, userId]
      );
      if (result.affectedRows === 0) {
        throw new DatabaseQueryError("User not found or update failed.");
      }
      return true;
    } catch (error) {
      this.handleError(error, connection, "Failed to update profile image");
    } finally {
      if (connection) connection.release();
    }
  }

  /**
   * Returns aggregated dashboard statistics for users.
   */
  async getDbInfo() {
    let connection;
    try {
      connection = await this.getConnectionWithSchema();
      const [rows] = await connection.query(`
        SELECT 
          SUM(CASE WHEN deleted = 0 AND status = 'validated' THEN 1 ELSE 0 END) AS numActiveUsers,
          SUM(CASE WHEN deleted = 1 OR deleted = 2 THEN 1 ELSE 0 END) AS numDeletedUsers,
          SUM(CASE WHEN deleted = 0 AND status = 'not_validated' THEN 1 ELSE 0 END) AS numInactiveUsers,
          SUM(CASE WHEN deleted = 0 AND status = 'validated' AND role = 'company' THEN 1 ELSE 0 END) AS numActiveCompanyUsers,
          SUM(CASE WHEN deleted = 0 AND status = 'validated' AND role = 'personal' THEN 1 ELSE 0 END) AS numActivePersonalUsers
        FROM users
      `);
      return rows[0];
    } catch (error) {
      this.handleError(error, connection, "Failed to get user stats");
    } finally {
      if (connection) connection.release();
    }
  }

  /**
   * Updates a user's password.
   */
  async updatePassword(userId, hashedPassword) {
    let connection;
    try {
      connection = await this.getConnectionWithSchema();
      await connection.query(`UPDATE users SET password = ? WHERE id = ? AND deleted = 0 AND status = 'validated`, [
        hashedPassword,
        userId,
      ]);
      return true;
    } catch (error) {
      this.handleError(error, connection, "Failed to update password");
    } finally {
      if (connection) connection.release();
    }
  }

  /**
   * Soft deletes a user by ID.
   */
  async softDelete(userId) {
    let connection;
    try {
      connection = await this.getConnectionWithSchema();
      const [result] = await connection.query(
        `UPDATE users SET deleted = 1 WHERE id = ? AND deleted = 0`,
        [userId]
      );
      if (result.affectedRows === 0) {
        throw new DatabaseQueryError("User not found or already deleted.");
      }
      return true;
    } catch (error) {
      this.handleError(error, connection, "Failed to soft delete user");
    } finally {
      if (connection) connection.release();
    }
  }

  /**
   * Deletes a user by ID (hard delete).
   */
  async hardDelete(userId) {
    let connection;
    try {
      connection = await this.getConnectionWithSchema();
      const [result] = await connection.query(
        `UPDATE users 
         SET 
           deleted = 2,
           email = NULL,
           password = NULL,
           validation_code = NULL,
           number_of_attempts = NULL,
           status = NULL,
           role = NULL,
           profile_url = NULL,
           profile_mem_type = NULL,
           profile_img_size = NULL,
           name = NULL,
           surname = NULL,
           nif = NULL,
           company_id = NULL
         WHERE id = ?`,
        [userId]
      );
      if (result.affectedRows === 0) {
        throw new DatabaseQueryError("User not found or already deleted.");
      }
      return true;
    } catch (error) {
      this.handleError(error, connection, "Failed to hard delete user");
    } finally {
      if (connection) connection.release();
    }
  }

  /**
   * Updates user information.
   */
  async updateUser(userId, { name, surname, NIF }) {
    let connection;
    try {
      connection = await this.getConnectionWithSchema();
      const [result] = await connection.query(
        `UPDATE users SET name = ?, surname = ?, nif = ?, role = 'personal' WHERE id = ? AND deleted = 0 AND status = 'validated'`,
        [name, surname, NIF, userId]
      );
      if (result.affectedRows === 0) {
        throw new DatabaseQueryError("User not found or update failed.");
      }
      return true;
    } catch (error) {
      this.handleError(error, connection, "Failed to update user");
    } finally {
      if (connection) connection.release();
    }
  }

  /**
   * Updates user information for company users.
   */
  async updateCompanyUser(userId, companyId) {
    let connection;
    try {
      connection = await this.getConnectionWithSchema();
      await connection.query(
        `UPDATE users SET company_id = ?, role = 'company' WHERE id = ? AND deleted = 0 AND status = 'validated'`,
        [companyId, userId]
      );
      return true;
    } catch (error) {
      this.handleError(error, connection, "Failed to update company user");
    } finally {
      if (connection) connection.release();
    }
  }
}

module.exports = new UserDAO();
