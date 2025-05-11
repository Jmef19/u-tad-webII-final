const { Client } = require("../entities");

const { JWTService } = require("../../../infrastructure/services");

class CreateClient {
  constructor(clientDAO) {
    this.clientDAO = clientDAO;
  }

  async execute({ name, CIF, address }, token) {
    const decoded = JWTService.verify(token);
    const client = new Client(name, CIF, address);
    client.userId = decoded.id;
    const createdClient = await this.clientDAO.create(client);
    return createdClient;
  }
}

module.exports = CreateClient;
