const { ValidationError } = require("../../errors");

class DeliveryNote {
  #id;
  #userId;
  #clientId;
  #projectId;
  #format;
  #material;
  #hours;
  #description;
  #date;

  constructor({ userId, clientId }) {
    this.userId = userId;
    this.clientId = clientId;
  }
  get id() {
    return this.#id;
  }

  get userId() {
    return this.#userId;
  }

  set userId(userId) {
    if (!userId || typeof userId !== "number") {
      throw new ValidationError("UserId must be a non-empty number");
    }
    this.#userId = userId;
  }

  get clientId() {
    return this.#clientId;
  }

  set clientId(clientId) {
    if (!clientId || typeof clientId !== "string" || clientId.trim() === "") {
      throw new ValidationError("ClientId must be a non-empty string");
    }
    this.#clientId = clientId;
  }

  get projectId() {
    return this.#projectId;
  }

  set projectId(projectId) {
    if (
      !projectId ||
      typeof projectId !== "string" ||
      projectId.trim() === ""
    ) {
      throw new ValidationError("ProjectId must be a non-empty string");
    }
    this.#projectId = projectId;
  }

  get format() {
    return this.#format;
  }

  set format(format) {
    if (!format || typeof format !== "string" || format.trim() === "") {
      throw new ValidationError("Format must be a non-empty string");
    }
    const validFormats = ["material", "hours"];
    if (!validFormats.includes(format)) {
      throw new ValidationError(
        `Format must be one of the following: ${validFormats.join(", ")}`
      );
    }
    this.#format = format;
  }

  get material() {
    return this.#material;
  }

  set material(material) {
    if (!material || typeof material !== "string" || material.trim() === "") {
      throw new ValidationError("Material must be a non-empty string");
    }
    this.#material = material;
  }

  get hours() {
    return this.#hours;
  }

  set hours(hours) {
    if (
      hours === undefined ||
      hours === null ||
      !Number.isInteger(hours) ||
      hours < 0
    ) {
      throw new ValidationError("Hours must be a positive number or zero");
    }
    this.#hours = hours;
  }

  get description() {
    return this.#description;
  }

  set description(description) {
    if (
      !description ||
      typeof description !== "string" ||
      description.trim() === ""
    ) {
      throw new ValidationError("Description must be a non-empty string");
    }
    this.#description = description;
  }

  get date() {
    return this.#date;
  }

  set date(date) {
    if (!date || !(date instanceof Date)) {
      throw new ValidationError("Date must be a valid Date object");
    }
    this.#date = date;
  }
}

module.exports = { DeliveryNote };
