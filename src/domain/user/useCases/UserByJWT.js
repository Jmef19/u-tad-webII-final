const { JWTService } = require("../../../infrastructure/services");

class UserByJWT {
  constructor(userDAO) {
    this.userDAO = userDAO;
  }

  async execute(token) {
    const decodedToken = JWTService.verify(token);
    const user = await this.userDAO.selectUserById(decodedToken.id);
    if (user.role === "company") {
      const userComplete = await this.userDAO.selectUserByIdWithCompany(user.company_id);
      return userComplete;
    }
    return user;
  }
}

module.exports = UserByJWT;
