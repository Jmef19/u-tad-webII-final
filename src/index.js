require("dotenv").config();
const startWeb = require("./infrastructure/web/express");

// net start mysql80
startWeb();
