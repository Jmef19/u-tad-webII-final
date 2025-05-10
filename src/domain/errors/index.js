const AlreadyExistsError = require("./AlreadyExistsError");
const ValidationError = require("./ValidationError");
const DatabaseConnectionError = require("./DatabaseConnectionError");
const DatabaseQueryError = require("./DatabaseQueryError");
const JWTError = require("./JWTError");
const UserNotFoundError = require("./UserNotFoundError");
const UserNotValidatedError = require("./UserNotValidatedError");
const ClientNotFoundError = require("./ClientNotFoundError");

module.exports = {
  AlreadyExistsError,
  ValidationError,
  DatabaseConnectionError,
  DatabaseQueryError,
  JWTError,
  UserNotFoundError,
  UserNotValidatedError,
  ClientNotFoundError,
};
