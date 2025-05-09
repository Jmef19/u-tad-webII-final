const {
  JWTService,
  BcryptService,
} = require("../../../infrastructure/services");

const { User } = require("../../user/entities");

class RecoverPassword {
  constructor(userDAO) {
    this.userDAO = userDAO;
  }

  async execute(token, newPassword) {
    const decoded = JWTService.verify(token);
    if (!decoded?.reset) {
      return null;
    }
    const user = await this.userDAO.selectUserById(decoded.id);
    const newUser = new User(user.email);
    newUser.password = newPassword;
    const hashedPassword = await BcryptService.hash(newPassword);
    await this.userDAO.updatePassword(user.id, hashedPassword);
    return { acknowledged: true };
  }
}

module.exports = RecoverPassword;
