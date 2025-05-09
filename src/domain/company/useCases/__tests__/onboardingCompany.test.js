const OnboardingCompany = require("../onboardingCompany");

const { JWTService } = require("../../../../infrastructure/services");

const { JWTError } = require("../../../../domain/errors");

afterEach(() => {
  jest.clearAllMocks();
});

describe("OnboardingCompany", () => {
  let mockCompanyDAO;
  let onboardingCompany;
  let onboardingCompanyService;

  beforeEach(() => {
    mockCompanyDAO = {
      create: jest.fn(),
    };
    onboardingCompany = new OnboardingCompany(mockCompanyDAO);

    // Mock JWTService.verify to return a user ID
    JWTService.verify = jest.fn().mockReturnValue({ id: 1 });

    onboardingCompanyService = {
      onboard: jest.fn(),
    };
  });
  it("should call onboardingCompanyService.onboard with correct data", async () => {
    const token = "valid.jwt.token";
    const companyData = {
      name: "Test Company",
      CIF: "A12345678",
      address: "123 Test St",
    };

    await onboardingCompany.execute(
      token,
      companyData,
      onboardingCompanyService
    );

    expect(JWTService.verify).toHaveBeenCalledWith(token);

    expect(onboardingCompanyService.onboard).toHaveBeenCalledWith(
      {
        name: "Test Company",
        CIF: "A12345678",
        address: "123 Test St",
      },
      1
    );
  });
  it("should throw an error if JWTService.verify fails", async () => {
    JWTService.verify = jest.fn(() => {
      throw new JWTError("Invalid token");
    });

    const token = "invalid.token";
    const companyData = {
      name: "Bad Company",
      CIF: "B00000000",
      address: "Nowhere",
    };

    await expect(
      onboardingCompany.execute(token, companyData, onboardingCompanyService)
    ).rejects.toThrow("Invalid token");

    expect(JWTService.verify).toHaveBeenCalledWith(token);
    expect(onboardingCompanyService.onboard).not.toHaveBeenCalled();
  });
});
