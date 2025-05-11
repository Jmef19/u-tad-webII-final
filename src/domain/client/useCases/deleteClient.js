const { JWTService } = require("../../../infrastructure/services");

class DeleteClient {
  constructor(clientDAO) {
    this.clientDAO = clientDAO;
  }

  // DELETE client based on parameters(soft/hard)
  async execute(id, token, soft = true) {
    const decoded = JWTService.verify(token);
    const userId = decoded.id;
    await this.clientDAO.checkIfUserOwnsClient(id, userId);
    await this.clientDAO.getDeliveryNoteByClientId(id);
    if (soft) {
      await this.clientDAO.softDelete(id);
    } else {
      await this.clientDAO.hardDelete(id);
    }
  }
}

module.exports = DeleteClient;
