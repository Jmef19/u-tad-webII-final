class UserNotValidatedError extends Error {
  constructor(message) {
    super(message);
    this.name = "UserNotValidatedError";
  }
}

module.exports = UserNotValidatedError;
