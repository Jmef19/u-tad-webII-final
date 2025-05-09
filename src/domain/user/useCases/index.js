const DeleteUser = require("./deleteUser");
const RecoverPassword = require("./recoverPassword");
const RequestPasswordReset = require("./requestPasswordReset");
const OnboardingUser = require("./onboardingUser");
const UserRegistration = require("./UserRegistration");
const DbInfo = require("./dbInfo");
const UserByJWT = require("./userByJWT");
const ValidateEmail = require("./validateEmail");
const UserLogin = require("./userLogin");
const UpdateProfileImage = require("./updateProfileImage");

module.exports = {
  DeleteUser,
  RecoverPassword,
  RequestPasswordReset,
  OnboardingUser,
  UserRegistration,
  DbInfo,
  UserByJWT,
  ValidateEmail,
  UserLogin,
  UpdateProfileImage,
};
