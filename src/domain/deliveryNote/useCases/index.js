const CreateDeliveryNote = require("./createDNote");
const GetAll = require("./getDNotes");
const GetDNoteById = require("./getDNoteById");
const PDFDNote = require("./pdfDNote");
const SignDNote = require("./signDNote");
const DeleteDNote = require("./deleteDNote");

module.exports = {
  CreateDeliveryNote,
  GetAll,
  GetDNoteById,
  PDFDNote,
  SignDNote,
  DeleteDNote,
};
