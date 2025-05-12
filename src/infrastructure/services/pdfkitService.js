const PDFDocument = require("pdfkit");

const PDFKitService = {
  generatePDF(logo, payload, res) {
    const doc = new PDFDocument({ margin: 50 });

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=delivery-note.pdf"
    );
    res.setHeader("Content-Type", "application/pdf");

    doc.pipe(res);

    if (logo?.profile_url) {
      doc.image(logo.profile_url, 50, 45, { width: 50 });
    }

    doc
      .fontSize(20)
      .font("Helvetica-Bold")
      .text("Delivery Note", { align: "center" });
    doc
      .fontSize(10)
      .font("Helvetica")
      .text("Generated on: " + new Date().toLocaleString(), {
        align: "center",
      });

    doc.moveTo(50, 100).lineTo(550, 100).stroke();

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

    const lineSpacing = 24;

    content.forEach(({ label, value }) => {
      doc
        .font("Helvetica-Bold")
        .fontSize(12)
        .text(label + ":", 50, y);

      const valueText = `${value}`;
      const valueWidth = doc.widthOfString(valueText);
      const valueX = (doc.page.width - valueWidth) / 2;

      doc.font("Helvetica").text(valueText, valueX, y);
      y += lineSpacing;
    });

    doc.end();
  },
};

module.exports = PDFKitService;
