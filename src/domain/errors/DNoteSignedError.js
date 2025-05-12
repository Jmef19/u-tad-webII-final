class DNoteSignedError extends Error {
  constructor(message) {
    super(message);
    this.name = "DNoteSignedError";
  }
}

module.exports = DNoteSignedError;
