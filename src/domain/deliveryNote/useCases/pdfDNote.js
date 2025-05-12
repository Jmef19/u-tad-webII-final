const {
  JWTService,
  PDFKitService,
} = require("../../../infrastructure/services");

class PDFDNote {
  constructor(deliveryNoteDAO) {
    this.deliveryNoteDAO = deliveryNoteDAO;
  }

  async execute(token, clientId, projectId, dNoteId, res) {
    const decoded = JWTService.verify(token);
    const userId = decoded.id;
    const deliveryNote = await this.deliveryNoteDAO.getById(
      dNoteId,
      userId,
      clientId,
      projectId
    );
    PDFKitService.generatePDF(deliveryNote, res);
  }
}

module.exports = PDFDNote;
