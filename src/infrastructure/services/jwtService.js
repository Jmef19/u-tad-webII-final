const jwt = require("jsonwebtoken");
const { JWTError } = require("../../domain/errors");

const JWTService = {
  generate(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
  },

  verify(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        throw new JWTError("Token has expired.");
      } else if (err.name === "JsonWebTokenError") {
        throw new JWTError("Invalid authentication token.");
      } else {
        throw new JWTError("JWT verification failed.");
      }
    }
  },

  verifyReset(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_RESET_SECRET);
      if (!decoded.reset) {
        throw new JWTError("Invalid reset token.");
      }
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        throw new JWTError("Token has expired.");
      } else if (err.name === "JsonWebTokenError") {
        throw new JWTError("Invalid authentication token.");
      } else {
        throw new JWTError("JWT verification failed.");
      }
    }
  },
};

module.exports = JWTService;
