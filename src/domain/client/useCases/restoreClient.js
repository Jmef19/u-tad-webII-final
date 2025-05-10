const { JWTService } = require("../../../infrastructure/services");

const {
  ClientNotFoundError,
  NotOwnedClientError,
} = require("../../../domain/errors");

class RestoreClient {
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
    const client = await this.clientDAO.getDeletedClientById(id);
    if (!client) {
      throw new ClientNotFoundError("Client not found, hard deleted");
    }
    await this.clientDAO.restore(client);
    return { message: "ACK" };
  }
}
module.exports = RestoreClient;
