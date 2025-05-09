class DatabaseQueryError extends Error {
  constructor(message) {
    super(message);
    this.name = "DatabaseQueryError";
  }
}

module.exports = DatabaseQueryError;
