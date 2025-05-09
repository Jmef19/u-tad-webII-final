const { Company } = require("../entities");

const { ValidationError } = require("../../errors");

describe("Company", () => {
  it("should create a company with valid data", () => {
    const company = new Company("Test Company", "A12345678", "123 Test St");
    expect(company.name).toBe("Test Company");
    expect(company.CIF).toBe("A12345678");
    expect(company.address).toBe("123 Test St");
  });
  it("should throw an error if name is empty", () => {
    expect(() => new Company("", "A12345678", "123 Test St")).toThrow(
      ValidationError
    );
  });
  it("should throw an error if name is not a string", () => {
    expect(() => new Company(123, "A12345678", "123 Test St")).toThrow(
      ValidationError
    );
  });
  it("should throw an error if CIF is empty", () => {
    expect(() => new Company("Test Company", "", "123 Test St")).toThrow(
      ValidationError
    );
  });
  it("should throw an error if CIF is invalid", () => {
    expect(
      () => new Company("Test Company", "INVALID_CIF", "123 Test St")
    ).toThrow(ValidationError);
  });
  it("should throw an error if address is empty", () => {
    expect(() => new Company("Test Company", "A12345678", "")).toThrow(
      ValidationError
    );
  });
  it("should throw an error if address is not a string", () => {
    expect(() => new Company("Test Company", "A12345678", 123)).toThrow(
      ValidationError
    );
  });
});
