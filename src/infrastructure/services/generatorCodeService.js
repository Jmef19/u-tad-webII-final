const generatorCodeService = {
  // The code generator should create a 6-digit ccode
  generate() {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    return code;
  },
};

module.exports = generatorCodeService;
