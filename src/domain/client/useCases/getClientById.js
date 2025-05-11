const { JWTService } = require("../../../infrastructure/services");

class GetClientById {
  constructor(clientDAO) {
    this.clientDAO = clientDAO;
  }

  async execute(id, token) {
    const decoded = JWTService.verify(token);
    const userId = decoded.id;
    await this.clientDAO.checkIfUserOwnsClient(id, userId);
    return await this.clientDAO.getById(id);
  }
}

module.exports = GetClientById;
