class DatabaseConnectionError extends Error {
  constructor(message) {
    super(message);
    this.name = "DatabaseConnectionError";
  }
}

module.exports = DatabaseConnectionError;
