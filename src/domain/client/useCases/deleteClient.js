const { DeliveryNoteExistingError } = require("../../../domain/errors");

const { JWTService } = require("../../../infrastructure/services");

const {
  ClientNotFoundError,
  NotOwnedClientError,
} = require("../../../domain/errors");

class DeleteClient {
  constructor(clientDAO) {
    this.clientDAO = clientDAO;
  }

  // DELETE client based on parameters(soft/hard)
  async execute(id, token, soft = true) {
    const decoded = JWTService.verify(token);
    const userId = decoded.userId;
    const valid = await this.clientDAO.isOwnedByUser(id, userId);
    if (!valid) {
      const exists = await this.clientDAO.getById(id);
      if (!exists) {
        throw new ClientNotFoundError("Client not found");
      }
      throw new NotOwnedClientError("Client not owned by user");
    }
    const deliveryNote = await this.clientDAO.getDeliveryNoteByClientId(id);
    if (deliveryNote) {
      throw new DeliveryNoteExistingError(
        "Cannot delete client with existing delivery notes."
      );
    }
    if (soft) {
      await this.clientDAO.softDelete(id);
    } else {
      await this.clientDAO.hardDelete(id);
    }
  }
}

module.exports = DeleteClient;
