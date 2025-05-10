const { DeliveryNoteExistingError } = require("../../../domain/errors");

const { JWTService } = require("../../../infrastructure/services");

const {
  ClientNotFoundError,
  NotOwnedClientError,
} = require("../../../domain/errors");

class DeleteProject {
  constructor(projectDAO) {
    this.projectDAO = projectDAO;
  }

  // DELETE project based on parameters(soft/hard)
  async execute(id, token, clientId, soft = true) {
    const decoded = JWTService.verify(token);
    const userId = decoded.userId;
    const valid = await this.projectDAO.isOwnedByUser(id, userId, clientId);
    if (!valid) {
      const exists = await this.projectDAO.getById(id);
      if (!exists) {
        throw new ClientNotFoundError("Project not found");
      }
      throw new NotOwnedClientError("Project not owned by user");
    }
    const deliveryNote = await this.projectDAO.getDeliveryNoteByProjectId(id);
    if (deliveryNote) {
      throw new DeliveryNoteExistingError(
        "Cannot delete project with existing delivery notes."
      );
    }
    if (soft) {
      await this.projectDAO.softDelete(id);
    } else {
      await this.projectDAO.hardDelete(id);
    }
  }
}

module.exports = DeleteProject;
