const { JWTService } = require("../../../infrastructure/services");

class RequestPasswordReset {
  constructor(userDAO) {
    this.userDAO = userDAO;
  }

  async execute(email) {
    const user = await this.userDAO.selectUserByEmail(email);
    const token = JWTService.generate({ id: user.id, reset: true }, "15m"); // expires in 15 mins

    // Normally you'd send an email here with a reset link
    // For this example, we'll just return the token
    return { resetToken: token, reset: true };
  }
}

module.exports = RequestPasswordReset;
