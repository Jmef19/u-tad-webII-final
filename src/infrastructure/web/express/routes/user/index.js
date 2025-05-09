const { Router } = require("express");
const UserDAO = require("../../../../persistence/mysql/user/userDAO");
const CompanyDAO = require("../../../../persistence/mysql/company/companyDAO");

const {
  UserRegistration,
  ValidateEmail,
  UserLogin,
  UpdateProfileImage,
  UserByJWT,
  DbInfo,
  RecoverPassword,
  RequestPasswordReset,
  DeleteUser,
  OnboardingUser,
} = require("../../../../../domain/user/useCases");

const {
  ValidationError,
  AlreadyExistsError,
  DatabaseConnectionError,
  DatabaseQueryError,
  JWTError,
  UserNotFoundError,
  UserNotValidatedError,
} = require("../../../../../domain/errors");

const { CreateUserDeleteService } = require("../../../../services");
const userDeleteService = CreateUserDeleteService({ UserDAO, CompanyDAO });

const router = Router();

// Centralized error handler for all routes
function handleError(error, res) {
  if (error instanceof ValidationError) {
    return res.status(422).json({ ValidationError: error.message });
  }
  if (error instanceof UserNotFoundError) {
    return res.status(404).json({ UserNotFoundError: error.message });
  }
  if (error instanceof UserNotValidatedError) {
    return res.status(401).json({ UserNotValidatedError: error.message });
  }
  if (error instanceof AlreadyExistsError) {
    return res.status(409).json({ AlreadyExistsError: error.message });
  }
  if (error instanceof JWTError) {
    return res.status(401).json({ JWTError: error.message });
  }
  if (error instanceof DatabaseConnectionError) {
    return res.status(500).json({ DatabaseConnectionError: error.message });
  }
  if (error instanceof DatabaseQueryError) {
    return res.status(500).json({ DatabaseQueryError: error.message });
  }
  return res.status(500).json({ error: error.message });
}

// Utility: extract token from Authorization header
function getTokenFromHeader(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    throw new JWTError(
      "Unauthorized. Authentication token is missing or invalid."
    );
  }
  return authHeader.split(" ")[1];
}

// Utility: validate body is empty
function assertEmptyBody(req) {
  if (req.body) {
    if (Object.keys(req.body).length > 0) {
      throw new ValidationError("Request body contains unexpected fields.");
    }
  }
}

// @route POST /register
// @desc Register a new user with email and password
router.post("/register", async (req, res) => {
  try {
    const { email, password, ...rest } = req.body;
    if (Object.keys(rest).length > 0) {
      throw new ValidationError("Request body contains unexpected fields.");
    }
    const userRegistration = new UserRegistration(UserDAO);
    const result = await userRegistration.execute({ email, password });
    if (!result) {
      throw new AlreadyExistsError("User already exists.");
    }
    return res.status(200).json(result);
  } catch (error) {
    handleError(error, res);
  }
});

// @route PUT /validation
// @desc Validate user email using a token and validation code
router.put("/validation", async (req, res) => {
  try {
    const token = getTokenFromHeader(req);
    const { code, ...rest } = req.body;
    if (Object.keys(rest).length > 0) {
      throw new ValidationError("Request body contains unexpected fields.");
    }
    const validateEmail = new ValidateEmail(UserDAO);
    const result = await validateEmail.execute({ token, validationCode: code });
    if (!result) {
      throw new ValidationError(
        "User not found or validation code is invalid."
      );
    }
    return res.status(200).json({ acknowledged: true });
  } catch (error) {
    handleError(error, res);
  }
});

// @route POST /login
// @desc Log in a user using email and password
router.post("/login", async (req, res) => {
  try {
    const { email, password, ...rest } = req.body;
    if (Object.keys(rest).length > 0) {
      throw new ValidationError("Request body contains unexpected fields.");
    }
    const userLogin = new UserLogin(UserDAO);
    const result = await userLogin.execute({ email, password });
    return res.status(200).json(result);
  } catch (error) {
    handleError(error, res);
  }
});

// @route PATCH /logo
// @desc Update user's profile image
router.patch("/logo", async (req, res) => {
  try {
    const token = getTokenFromHeader(req);
    if (!req.files?.image) {
      throw new ValidationError("Image file is required.");
    }
    const updateProfileImage = new UpdateProfileImage(UserDAO);
    const result = await updateProfileImage.execute(token, req.files.image);
    return res.status(200).json(result);
  } catch (error) {
    handleError(error, res);
  }
});

// @route GET /me
// @desc Get user information from JWT token
router.get("/me", async (req, res) => {
  try {
    assertEmptyBody(req);
    const token = getTokenFromHeader(req);
    const userByJWT = new UserByJWT(UserDAO);
    const result = await userByJWT.execute(token);
    return res.status(200).json(result);
  } catch (error) {
    handleError(error, res);
  }
});

// @route GET /dashboard
// @desc Get database dashboard info
router.get("/dashboard", async (req, res) => {
  try {
    assertEmptyBody(req);
    const token = getTokenFromHeader(req);
    const dbInfo = new DbInfo(UserDAO);
    const result = await dbInfo.execute(token);
    return res.status(200).json(result);
  } catch (error) {
    handleError(error, res);
  }
});

// @route POST /password/request
// @desc Request password reset link for a user
router.post("/password/request", async (req, res) => {
  try {
    const { email, ...rest } = req.body;
    if (Object.keys(rest).length > 0) {
      throw new ValidationError("Request body contains unexpected fields.");
    }
    const useCase = new RequestPasswordReset(UserDAO);
    const result = await useCase.execute(email);
    return res.status(200).json(result);
  } catch (err) {
    handleError(err, res);
  }
});

// @route POST /password/recover
// @desc Reset user password using recovery token
router.post("/password/recover", async (req, res) => {
  try {
    const token = getTokenFromHeader(req);
    const { password, ...rest } = req.body;
    if (Object.keys(rest).length > 0) {
      throw new ValidationError("Request body contains unexpected fields.");
    }
    const useCase = new RecoverPassword(UserDAO);
    const result = await useCase.execute(token, password);
    if (!result) {
      throw new JWTError("Invalid token");
    }
    return res.status(200).json(result);
  } catch (err) {
    handleError(err, res);
  }
});

// @route DELETE /user
// @desc Delete a user (soft or hard) using JWT token
router.delete("/delete", async (req, res) => {
  try {
    const token = getTokenFromHeader(req);
    const { soft } = req.query;
    if (soft === undefined) {
      throw new ValidationError("Query parameter 'soft' is required.");
    }
    if (soft !== "true" && soft !== "false") {
      throw new ValidationError(
        "Query parameter 'soft' must be 'true' or 'false'."
      );
    }
    const deleteUser = new DeleteUser(UserDAO);
    await deleteUser.execute(token, userDeleteService, soft === "true");
    return res.status(200).json({ acknowledged: true });
  } catch (error) {
    handleError(error, res);
  }
});

// @route POST /onboarding
// @desc Onboard a new user
router.patch("/onboarding", async (req, res) => {
  try {
    const token = getTokenFromHeader(req);
    const { name, surname, NIF, ...rest } = req.body;
    if (Object.keys(rest).length > 0) {
      throw new ValidationError("Request body contains unexpected fields.");
    }
    const onboardingUser = new OnboardingUser(UserDAO);
    await onboardingUser.execute(token, { name, surname, NIF });

    return res.status(200).json({ acknowledged: true });
  } catch (error) {
    handleError(error, res);
  }
});

module.exports = router;
