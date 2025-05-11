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
    const userId = decoded.id;
    await this.clientDAO.checkIfUserOwnsClient(id, userId);
    const client = await this.clientDAO.getDeletedClientById(id);
    await this.clientDAO.restore(client);
    return { message: "ACK" };
  }
}
module.exports = RestoreClient;
