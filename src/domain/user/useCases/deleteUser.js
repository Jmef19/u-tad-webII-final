const { JWTService } = require("../../../infrastructure/services");

class DeleteUser {
  constructor(userDAO) {
    this.userDAO = userDAO;
  }

  // DELETE User (hard or soft based on a query parameter ?soft=false) by JWT Token (1 point)
  async execute(token, UserDeleteService, soft = true) {
    const decoded = JWTService.verify(token);
    const user = await this.userDAO.selectUserById(decoded.id);
    if (soft) {
      await this.userDAO.softDelete(user.id);
    } else {
      await UserDeleteService.hardDeleteUser(user.id, user.company_id);
    }
  }
}

module.exports = DeleteUser;
