function CreateUserDeleteService({ UserDAO, CompanyDAO }) {
  return {
    async hardDeleteUser(userId, companyId) {
      await UserDAO.hardDelete(userId);
      await CompanyDAO.handleUserDeletion(companyId);
    },
  };
}

module.exports = CreateUserDeleteService;
