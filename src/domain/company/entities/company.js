const { ValidationError } = require("../../errors");

class Company {
  #name;
  #CIF;
  #address;

  constructor(name, CIF, address) {
    this.name = name;
    this.CIF = CIF;
    this.address = address;
  }

  get name() {
    return this.#name;
  }

  set name(name) {
    if (!name || typeof name !== "string" || name.trim() === "") {
      throw new ValidationError("Company name must be a non-empty string");
    }
    this.#name = name;
  }

  get CIF() {
    return this.#CIF;
  }

  set CIF(CIF) {
    const cifRegex = /^[ABCDEFGHJKLMNPQRSUVW]\d{7}[0-9A-J]$/;
    if (!CIF || !cifRegex.test(CIF)) {
      throw new ValidationError("Invalid CIF format, (e.g. A12345678) ");
    }
    this.#CIF = CIF;
  }

  get address() {
    return this.#address;
  }

  set address(address) {
    if (!address || typeof address !== "string" || address.trim() === "") {
      throw new ValidationError("Company address must be a non-empty string");
    }
    this.#address = address;
  }
}

module.exports = { Company };
