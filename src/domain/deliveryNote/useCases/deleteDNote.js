const { JWTService } = require("../../../infrastructure/services");

class DeleteDNote {
  constructor(dNoteDAO) {
    this.dNoteDAO = dNoteDAO;
  }

  // DELETE delivery note based on parameters(soft/hard)
  async execute(id, token, clientId, projectId, soft = true) {
    const decoded = JWTService.verify(token);
    const userId = decoded.userId;
    await this.dNoteDAO.checkIfProjectBelongsToClientBelongingToUser(
      userId,
      clientId,
      projectId
    );
    await this.dNoteDAO.checkIfSigned(id, userId, clientId, projectId);
    if (soft) {
      await this.dNoteDAO.softDelete(id, userId, clientId, projectId);
    } else {
      await this.dNoteDAO.hardDelete(id, userId, clientId, projectId);
    }
  }
}

module.exports = DeleteDNote;
