const { User } = require("../entities/user");

const {
  BcryptService,
  JWTService,
  GeneratorCodeService,
} = require("../../../infrastructure/services");

class UserRegistration {
  constructor(userDAO) {
    this.userDAO = userDAO;
  }

  async execute({ email, password }) {
    const newUser = new User(email);
    const existingUser = await this.userDAO.findValidatedUserByEmail(email);
    if (existingUser) {
      return null;
    }
    newUser.password = password;
    newUser.password = await BcryptService.hash(password);
    newUser.validationCode = GeneratorCodeService.generate();

    const result = await this.userDAO.userRegistration(newUser);
    const token = JWTService.generate(
      { id: result.id },
      { email: result.email },
      { expiresIn: process.env.JWT_EXPIRATION }
    );
    return {
      token: token,
      email: result.email,
      status: result.status,
      role: result.role,
    };
  }
}

module.exports = UserRegistration;
