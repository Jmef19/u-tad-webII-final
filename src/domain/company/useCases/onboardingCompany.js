const { Company } = require("../entities/company");

const { JWTService } = require("../../../infrastructure/services");

class OnboardingCompany {
  constructor(companyDAO) {
    this.companyDAO = companyDAO;
  }

  async execute(token, { name, CIF, address }, onboardingCompanyService) {
    const decoded = JWTService.verify(token);
    const newCompany = new Company(name, CIF, address);

    onboardingCompanyService.onboard(
      {
        name: newCompany.name,
        CIF: newCompany.CIF,
        address: newCompany.address,
      },
      decoded.id
    );
  }
}

module.exports = OnboardingCompany;
