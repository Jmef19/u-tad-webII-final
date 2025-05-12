const { DeliveryNote } = require("../entities");

const { JWTService } = require("../../../infrastructure/services");

class CreateDeliveryNote {
  constructor(deliveryNoteDAO) {
    this.deliveryNoteDAO = deliveryNoteDAO;
  }

  async execute(
    { clientId, projectId, format, material, hours, description },
    token
  ) {
    const decoded = JWTService.verify(token);
    const userId = decoded.id;
    const deliveryNote = new DeliveryNote({
      userId,
      clientId,
    });
    deliveryNote.projectId = projectId;
    deliveryNote.format = format;
    deliveryNote.material = material;
    deliveryNote.hours = hours;
    deliveryNote.description = description;
    deliveryNote.date = new Date();
    await this.deliveryNoteDAO.checkIfExists(
      userId,
      clientId,
      projectId,
      format,
      material,
      hours,
      description
    );
    return await this.deliveryNoteDAO.create(deliveryNote);
  }
}

module.exports = CreateDeliveryNote;
