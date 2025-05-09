const { ValidationError } = require("../../errors");

class User {
  #id;
  #email;
  #password;
  #validationCode;
  #numberOfAttempts;
  #status;
  #deleted;
  #role;
  #profileUrl;
  #profileMemType;
  #profileImgSize;
  #name;
  #surname;
  #NIF;
  #companyId;

  constructor(email) {
    this.email = email;
  }

  // Getters and Setters

  get id() {
    return this.#id;
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

  get password() {
    return this.#password;
  }

  set password(value) {
    if (typeof value !== "string") {
      throw new ValidationError("Password must be a string");
    }
    if (value.length < 8) {
      throw new ValidationError("Password must be at least 8 characters long");
    }
    this.#password = value;
  }

  get validationCode() {
    return this.#validationCode;
  }

  set validationCode(value) {
    if (typeof value !== "string") {
      throw new ValidationError("Validation code must be a string");
    }
    if (value.length !== 6) {
      throw new ValidationError("Validation code must be 6 characters long");
    }
    this.#validationCode = value;
  }

  get numberOfAttempts() {
    return this.#numberOfAttempts;
  }

  set numberOfAttempts(value) {
    this.#numberOfAttempts = value;
  }

  get status() {
    return this.#status;
  }

  set status(value) {
    this.#status = value;
  }

  get deleted() {
    return this.#deleted;
  }

  set deleted(value) {
    this.#deleted = value;
  }

  get role() {
    return this.#role;
  }

  set role(value) {
    this.#role = value;
  }

  get profileUrl() {
    return this.#profileUrl;
  }

  set profileUrl(value) {
    this.#profileUrl = value;
  }

  get profileMemType() {
    return this.#profileMemType;
  }

  set profileMemType(value) {
    this.#profileMemType = value;
  }

  get profileImgSize() {
    return this.#profileImgSize;
  }

  set profileImgSize(value) {
    this.#profileImgSize = value;
  }

  get name() {
    return this.#name;
  }

  set name(value) {
    if (typeof value !== "string") {
      throw new ValidationError("Name must be a string");
    }
    if (value.length < 2) {
      throw new ValidationError("Name must be at least 2 characters long");
    }
    if (!/^[a-zA-Z]+$/.test(value)) {
      throw new ValidationError("Name can only contain letters");
    }
    this.#name = value;
  }

  get surname() {
    return this.#surname;
  }

  set surname(value) {
    if (typeof value !== "string") {
      throw new ValidationError("Surname must be a string");
    }
    if (value.length < 2) {
      throw new ValidationError("Surname must be at least 2 characters long");
    }
    if (!/^[a-zA-Z]+$/.test(value)) {
      throw new ValidationError("Surname can only contain letters");
    }
    this.#surname = value;
  }

  get NIF() {
    return this.#NIF;
  }

  set NIF(value) {
    if (typeof value !== "string") {
      throw new ValidationError("NIF must be a string");
    }
    if (!/^\d{8}[A-Z]$/.test(value)) {
      throw new ValidationError("NIF must be in the format 12345678A");
    }
    this.#NIF = value;
  }

  get companyId() {
    return this.#companyId;
  }

  set companyId(value) {
    this.#companyId = value;
  }
}

module.exports = { User };
