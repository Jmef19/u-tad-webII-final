const { Client } = require("../entities");

const { JWTService } = require("../../../infrastructure/services");

const {
  ClientNotFoundError,
  NotOwnedClientError,
} = require("../../../domain/errors");

class UpdateClient {
  constructor(clientDAO) {
    this.clientDAO = clientDAO;
  }

  async execute({ name, CIF, address }, id, token) {
    const decoded = JWTService.verify(token);
    const userId = decoded.id;
    await this.clientDAO.checkIfUserOwnsClient(id, userId);

    const client = new Client(name, CIF, address);
    await this.clientDAO.getByCIF(client.CIF);

    const updatedClient = await this.clientDAO.update(client);
    console.log("Updated client:", updatedClient);
    return updatedClient;
  }
}
module.exports = UpdateClient;
