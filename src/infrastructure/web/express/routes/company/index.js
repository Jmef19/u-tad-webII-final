const { Router } = require("express");
const CompanyDAO = require("../../../../persistence/mysql/company/companyDAO");
const UserDAO = require("../../../../persistence/mysql/user/userDAO");

const { OnboardingCompany } = require("../../../../../domain/company/useCases");

const {
  ValidationError,
  DatabaseConnectionError,
  DatabaseQueryError,
  JWTError,
} = require("../../../../../domain/errors");

const { CreateOnboardingCompanyService } = require("../../../../services");

const onboardingCompanyService = CreateOnboardingCompanyService({
  UserDAO,
  CompanyDAO,
});

const router = Router();

// Centralized error handler for all routes
function handleError(error, res) {
  if (error instanceof ValidationError) {
    return res.status(422).json({ ValidationError: error.message });
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

// @route PATCH /onboarding
// @desc Onboard a new company
router.patch("/onboarding", async (req, res) => {
  try {
    const token = getTokenFromHeader(req);
    const { name, CIF, address, ...rest } = req.body;
    if (Object.keys(rest).length > 0) {
      throw new ValidationError("Request body contains unexpected fields.");
    }

    const onboardingUser = new OnboardingCompany(CompanyDAO);
    await onboardingUser.execute(
      token,
      { name, CIF, address },
      onboardingCompanyService
    );

    return res.status(200).json({ acknowledged: true });
  } catch (error) {
    handleError(error, res);
  }
});

module.exports = router;
