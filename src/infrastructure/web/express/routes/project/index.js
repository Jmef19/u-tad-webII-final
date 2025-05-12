const { Router } = require("express");

const ProjectDAO = require("../../../../persistence/mysql/project/projectDAO");

const {
  JWTError,
  DeliveryNoteExistingError,
  ValidationError,
  ClientNotFoundError,
  NotOwnedClientError,
  DatabaseConnectionError,
  DatabaseQueryError,
  AlreadyExistsError,
  UserNotFoundError,
  ProjectNotFoundError,
  NotOwnedProjectError,
} = require("../../../../../domain/errors");

const { CreateProject } = require("../../../../../domain/project/useCases");

const router = Router();

function handleError(error, res) {
  if (error instanceof JWTError) {
    res.status(401).json({ error: error.message });
  } else if (error instanceof ValidationError) {
    res.status(422).json({ error: error.message });
  } else if (
    error instanceof ClientNotFoundError ||
    error instanceof UserNotFoundError ||
    error instanceof ProjectNotFoundError
  ) {
    res.status(404).json({ error: error.message });
  } else if (
    error instanceof NotOwnedClientError ||
    error instanceof DeliveryNoteExistingError ||
    error instanceof NotOwnedProjectError
  ) {
    res.status(403).json({ error: error.message });
  } else if (error instanceof AlreadyExistsError) {
    res.status(409).json({ error: error.message });
  } else if (error instanceof DatabaseConnectionError) {
    res.status(500).json({ error: "Database connection error" });
  } else if (error instanceof DatabaseQueryError) {
    res.status(500).json({ error: "Database query error" });
  } else {
    console.error("Unexpected error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

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

// @route POST /create
// @desc Create a new project
router.post("/create", async (req, res) => {
  try {
    const token = getTokenFromHeader(req);
    const { name, email, address, clientId, projectCode, ...rest } = req.body;
    if (Object.keys(rest).length > 0) {
      throw new ValidationError("Request body contains unexpected fields.");
    }
    const createProject = new CreateProject(ProjectDAO);
    const result = await createProject.execute(
      {
        name,
        email,
        address,
        clientId,
        projectCode,
      },
      token
    );
    res.status(200).json(result);
  } catch (error) {
    handleError(error, res);
  }
});

module.exports = router;
