const { JWTService } = require("../../../infrastructure/services");

const {
  ClientNotFoundError,
  NotOwnedClientError,
} = require("../../../domain/errors");

class GetClientById {
  constructor(clientDAO) {
    this.clientDAO = clientDAO;
  }

  async execute(id, token) {
    const decoded = JWTService.verify(token);
    const userId = decoded.userId;
    const valid = await this.clientDAO.isOwnedByUser(id, userId);
    if (!valid) {
      const exists = await this.clientDAO.getById(id);
      if (!exists) {
        throw new ClientNotFoundError("Client not found");
      }
      throw new NotOwnedClientError("Client not owned by user");
    }
    return exists;
  }
}

module.exports = GetClientById;
