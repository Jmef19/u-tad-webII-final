class DbInfo {
  constructor(userDAO) {
    this.userDAO = userDAO;
  }

  async execute() {
    return await this.userDAO.getDbInfo();
  }
}

module.exports = DbInfo;
