const { JWTService } = require("../../../infrastructure/services");

class GetDNoteById {
  constructor(deliveryNoteDAO) {
    this.deliveryNoteDAO = deliveryNoteDAO;
  }

  async execute(token, clientId, projectId, dNoteId) {
    const decoded = JWTService.verify(token);
    const userId = decoded.id;
    return await this.deliveryNoteDAO.getById(
      dNoteId,
      userId,
      clientId,
      projectId
    );
  }
}

module.exports = GetDNoteById;
