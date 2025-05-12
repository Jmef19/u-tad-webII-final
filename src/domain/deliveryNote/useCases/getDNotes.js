const { JWTService } = require("../../../infrastructure/services");

class GetDNotes {
  constructor(deliveryNoteDAO) {
    this.deliveryNoteDAO = deliveryNoteDAO;
  }

  async execute(token, clientId, projectId) {
    const decoded = JWTService.verify(token);
    const userId = decoded.id;
    const deliveryNotes = await this.deliveryNoteDAO.getAll(
      userId,
      clientId,
      projectId
    );
    return deliveryNotes;
  }
}

module.exports = GetDNotes;
