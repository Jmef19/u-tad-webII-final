const CreateDeliveryNote = require("./createDNote");
const GetAll = require("./getDNotes");
const GetDNoteById = require("./getDNoteById");
const PDFDNote = require("./pdfDNote");
const SignDNote = require("./signDNote");

module.exports = {
  CreateDeliveryNote,
  GetAll,
  GetDNoteById,
  PDFDNote,
  SignDNote,
};
