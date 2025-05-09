const OnboardingCompany = require("../onboardingCompany");
const { JWTService } = require("../../../../infrastructure/services");
const { JWTError } = require("../../../../domain/errors");

// Reset and clear mocks
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

    onboardingCompanyService = {
      onboard: jest.fn(),
    };

    onboardingCompany = new OnboardingCompany(mockCompanyDAO);
  });

  it("should call onboardingCompanyService.onboard with correct data when token is valid", async () => {
    JWTService.verify = jest.fn().mockReturnValue({ id: 1 });

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
      companyData,
      1
    );
  });

  it("should throw JWTError if the token is expired", async () => {
    const token = "expired.token";
    JWTService.verify = jest.fn(() => {
      throw new JWTError("Token has expired.");
    });

    await expect(
      onboardingCompany.execute(token, {}, onboardingCompanyService)
    ).rejects.toThrow(JWTError);

    expect(JWTService.verify).toHaveBeenCalledWith(token);
    expect(onboardingCompanyService.onboard).not.toHaveBeenCalled();
  });

  it("should throw JWTError if the token is invalid", async () => {
    const token = "invalid.token";
    JWTService.verify = jest.fn(() => {
      throw new JWTError("Invalid authentication token.");
    });

    await expect(
      onboardingCompany.execute(token, {}, onboardingCompanyService)
    ).rejects.toThrow(JWTError);

    expect(JWTService.verify).toHaveBeenCalledWith(token);
    expect(onboardingCompanyService.onboard).not.toHaveBeenCalled();
  });
});
