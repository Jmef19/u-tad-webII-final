const { JWTService } = require("../../../infrastructure/services");

class GetClients {
  constructor(clientDAO) {
    this.clientDAO = clientDAO;
  }

  async execute(token) {
    const decoded = JWTService.verify(token);
    const clients = await this.clientDAO.getAll(decoded.id);
    return clients;
  }
}
module.exports = GetClients;
