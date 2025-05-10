const { Client } = require("../entities");

class UpdateClient {
  constructor(clientDAO) {
    this.clientDAO = clientDAO;
  }

  async execute({ id, name, CIF, address }, token) {
    const client = new Client({ name, CIF, address });
    client.id = id;
    const updatedClient = await this.clientDAO.update(client);
    return updatedClient;
  }
}
module.exports = UpdateClient;
