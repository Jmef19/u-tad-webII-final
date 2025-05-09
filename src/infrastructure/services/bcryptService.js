const bcrypt = require("bcrypt");

const BcryptService = {
  async hash(password) {
    return await bcrypt.hash(password, 10);
  },
  async compare(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  },
};

module.exports = BcryptService;
