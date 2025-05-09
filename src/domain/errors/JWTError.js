class JWTError extends Error {
  constructor(message) {
    super(message);
    this.name = "JWTErrors";
  }
}

module.exports = JWTError;
