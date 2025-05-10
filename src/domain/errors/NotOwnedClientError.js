class NotOwnedClientError extends Error {
  constructor(message) {
    super(message);
    this.name = "NotOwnedClientError";
  }
}

module.exports = NotOwnedClientError;
