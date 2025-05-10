const { ValidationError } = require("../../errors");

class Project {
  #id;
  #name;
  #email;
  #address;
  #userId;
  #clientId;

  constructor({ name, email, address, clientId }) {
    this.#name = name;
    this.#email = email;
    this.#address = address;
    this.#clientId = clientId;
  }

  get id() {
    return this.#id;
  }

  get name() {
    return this.#name;
  }

  set name(name) {
    if (
      !name ||
      typeof name !== "string" ||
      name.trim() === ""
    ) {
      throw new ValidationError("Company name must be a non-empty string");
    }
    this.#name = name;
  }

  get email() {
    return this.#email;
  }

  set email(value) {
    if (typeof value !== "string") {
      throw new ValidationError("Email must be a string");
    }
    const emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!emailRegex.test(value)) {
      throw new ValidationError("Invalid email format");
    }
    this.#email = value;
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

  get userId() {
    return this.#userId;
  }

  set userId(userId) {
    if (!userId || typeof userId !== "number") {
      throw new ValidationError("User ID must be a number");
    }
    this.#userId = userId;
  }

  get clientId() {
    return this.#clientId;
  }
}

module.exports = { Project };
