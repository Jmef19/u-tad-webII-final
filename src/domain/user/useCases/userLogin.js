const { User } = require("../entities/user");
const { ValidationError, UserNotValidatedError } = require("../../errors");
const {
  BcryptService,
  JWTService,
} = require("../../../infrastructure/services");

class UserLogin {
  constructor(userDAO) {
    this.userDAO = userDAO;
  }

  async execute(user) {
    const newUser = new User(user.email);
    newUser.password = user.password;

    const dbUser = await this.userDAO.selectUserByEmail(newUser.email);
    if (dbUser.deleted === "1") {
      throw new ValidationError("User deleted");
    }
    if (dbUser.status !== "validated") {
      throw new UserNotValidatedError("User not validated");
    }

    const isPasswordValid = await BcryptService.compare(
      newUser.password,
      dbUser.password
    );
    if (!isPasswordValid) {
      throw new ValidationError("Invalid password");
    }
    const token = JWTService.generate({
      id: dbUser.id,
      email: dbUser.email,
    });
    return {
      token: token,
      email: dbUser.email,
      status: dbUser.status,
      role: dbUser.role,
    };
  }
}

module.exports = UserLogin;
