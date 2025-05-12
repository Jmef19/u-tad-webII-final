const PDFDocument = require("pdfkit");

const PDFKitService = {
  generatePDF(payload, res) {
    const doc = new PDFDocument();

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=delivery-note.pdf"
    );
    res.setHeader("Content-Type", "application/pdf");

    doc.pipe(res);

    doc.fontSize(25).text("Delivery Note", 100, 80);

    const content = [
      { label: "Client ID", value: payload.client_id },
      { label: "Project ID", value: payload.project_id },
      { label: "Format", value: payload.format },
      { label: "Material", value: payload.material },
      { label: "Hours", value: payload.hours },
      { label: "Description", value: payload.description },
      { label: "Date", value: payload.date },
      { label: "Signed", value: payload.signed },
    ];

    let y = 120;
    const lineSpacing = 20;

    content.forEach((item) => {
      doc.fontSize(12).text(`${item.label}: ${item.value}`, 100, y);
      y += lineSpacing;
    });

    doc.end();
  },
};

module.exports = PDFKitService;
