const { JWTService } = require("../../../infrastructure/services");

class ValidateEmail {
  constructor(userDAO) {
    this.userDAO = userDAO;
  }

  async execute({ token, validationCode }) {
    let decoded = JWTService.verify(token);
    const userId = decoded.id;
    const user = await this.userDAO.checkValidationCode(userId, validationCode);
    if (!user) {
      const numberOfAttempts = await this.userDAO.getNumberOfAttempts(userId);
      if (numberOfAttempts >= process.env.NUMBER_OF_ATTEMPTS) {
        // Handle the case where the maximum number of attempts is reached
        // Usually we would send another validation email or lock the account
        // We wont do that here for simplicity
        console.log("Maximum number of attempts reached");
      } else {
        // Increment the number of attempts
        await this.userDAO.updateNumberOfAttempts(userId, numberOfAttempts + 1);
      }
      return null;
    }
    await this.userDAO.codeValidation(user.id);
    return {
      status: 200,
      message: "Email validated successfully",
    };
  }
}

module.exports = ValidateEmail;
