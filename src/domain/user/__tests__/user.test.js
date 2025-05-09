const { User } = require("../entities");
const { ValidationError } = require("../../errors");

describe("User", () => {
  it("should create a user with valid email", () => {
    const user = new User("email@gmail.com");
    expect(user.email).toBe("email@gmail.com");
  });
  it("should throw an error if email is empty", () => {
    expect(() => new User("")).toThrow(ValidationError);
  });
  it("should throw an error if email is not a string", () => {
    expect(() => new User(123)).toThrow(ValidationError);
  });
  it("should throw an error if email is invalid", () => {
    expect(() => new User("invalid-email")).toThrow(ValidationError);
  });
});
