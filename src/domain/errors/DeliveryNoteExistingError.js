class DeliveryNoteExistingError extends Error {
  constructor(message) {
    super(message);
    this.name = "DeliveryNoteExistingError";
  }
}

module.exports = DeliveryNoteExistingError;
