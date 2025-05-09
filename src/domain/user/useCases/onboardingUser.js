const { User } = require("../entities/user");

const { JWTService } = require("../../../infrastructure/services");

class OnboardingUser {
  constructor(userDAO) {
    this.userDAO = userDAO;
  }

  async execute(token, { name, surname, NIF }) {
    const decoded = JWTService.verify(token);
    const user = await this.userDAO.selectUserById(decoded.id);

    const newUser = new User(user.email);
    newUser.name = name;
    newUser.surname = surname;
    newUser.NIF = NIF;

    await this.userDAO.updateUser(user.id, {
      name: newUser.name,
      surname: newUser.surname,
      NIF: newUser.NIF,
    });
  }
}

module.exports = OnboardingUser;
