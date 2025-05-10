class ClientNotFoundError extends Error {
    constructor(message) {
      super(message);
      this.name = "ClientNotFound";
    }
  }
  
  module.exports = ClientNotFoundError;