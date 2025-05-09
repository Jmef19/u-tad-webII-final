function CreateOnboardingCompanyService({ UserDAO, CompanyDAO }) {
  return {
    async onboard({ name, CIF, address }, userId) {
      const [company] = await CompanyDAO.updateCompany({ name, CIF, address });
      await UserDAO.updateCompanyUser(userId, company.id);
    },
  };
}

module.exports = CreateOnboardingCompanyService;
