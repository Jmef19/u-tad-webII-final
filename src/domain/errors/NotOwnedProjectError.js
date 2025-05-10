class NotOwnedProjectError extends Error {
  constructor(message) {
    super(message);
    this.name = "NotOwnedProjectError";
  }
}

module.exports = NotOwnedProjectError;
