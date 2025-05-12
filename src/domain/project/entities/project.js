const { ValidationError } = require("../../errors");

class Project {
  #id;
  #projectCode;
  #name;
  #email;
  #address;
  #userId;
  #clientId;

  constructor({ name, email, address, clientId, projectCode }) {
    this.projectCode = projectCode;
    this.name = name;
    this.email = email;
    this.address = address;
    this.clientId = clientId;
  }

  get id() {
    return this.#id;
  }

  get name() {
    return this.#name;
  }

  set name(name) {
    if (!name || typeof name !== "string" || name.trim() === "") {
      throw new ValidationError("Project name must be a non-empty string");
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
      throw new ValidationError("Project address must be a non-empty string");
    }
    this.#address = address;
  }

  get userId() {
    return this.#userId;
  }

  set userId(userId) {
    if (!userId || typeof userId !== "number" || userId <= 0) {
      throw new ValidationError("User ID must be a positive integer");
    }
    this.#userId = userId;
  }

  get clientId() {
    return this.#clientId;
  }
  set clientId(clientId) {
    if (!clientId || typeof clientId !== "number" || clientId <= 0) {
      throw new ValidationError("Client ID must be a positive integer");
    }
    this.#clientId = clientId;
  }

  get projectCode() {
    return this.#projectCode;
  }

  set projectCode(projectCode) {
    if (
      !projectCode ||
      typeof projectCode !== "string" ||
      projectCode.trim() === ""
    ) {
      throw new ValidationError("Project code must be a non-empty string");
    }
    this.#projectCode = projectCode;
  }
}

module.exports = { Project };
