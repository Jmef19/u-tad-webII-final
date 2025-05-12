class DNotesNotFound extends Error {
  constructor(message) {
    super(message);
    this.name = "DNotesNotFound";
  }
}

module.exports = DNotesNotFound;
