const { ValidationError } = require("../../errors");

class Client {
  #id;
  #name;
  #CIF;
  #address;
  #userId;

  constructor({ name, CIF, address }) {
    this.#name = name;
    this.#CIF = CIF;
    this.#address = address;
  }

  get id() {
    return this.#id;
  }

  get name() {
    return this.#name;
  }

  get CIF() {
    return this.#CIF;
  }

  get address() {
    return this.#address;
  }

  get userId() {
    return this.#userId;
  }

  set name(name) {
    if (!name || typeof name !== "string" || name.trim() === "") {
      throw new ValidationError("Company name must be a non-empty string");
    }
    this.#name = name;
  }

  set CIF(CIF) {
    const cifRegex = /^[ABCDEFGHJKLMNPQRSUVW]\d{7}[0-9A-J]$/;
    if (!CIF || !cifRegex.test(CIF)) {
      throw new ValidationError("Invalid CIF format, (e.g. A12345678) ");
    }
    this.#CIF = CIF;
  }

  set address(address) {
    if (!address || typeof address !== "string" || address.trim() === "") {
      throw new ValidationError("Company address must be a non-empty string");
    }
    this.#address = address;
  }
}

module.exports = { Client };
