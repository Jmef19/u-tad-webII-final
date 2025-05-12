const {
  JWTService,
  UploadService,
  PDFKitService,
} = require("../../../infrastructure/services");

class SignDNote {
  constructor(deliveryNoteDAO) {
    this.deliveryNoteDAO = deliveryNoteDAO;
  }

  async execute(token, clientId, projectId, dNoteId) {
    const decoded = JWTService.verify(token);
    const userId = decoded.id;
    await this.deliveryNoteDAO.sign(dNoteId, userId, clientId, projectId);
    const deliveryNote = await this.deliveryNoteDAO.getById(
      dNoteId,
      userId,
      clientId,
      projectId
    );
    const pdfBuffer = await PDFKitService.generatePDFBuffer(deliveryNote);
    await UploadService.uploadPDF(pdfBuffer);
    return await this.deliveryNoteDAO.getById(
      dNoteId,
      userId,
      clientId,
      projectId
    );
  }
}

module.exports = SignDNote;
