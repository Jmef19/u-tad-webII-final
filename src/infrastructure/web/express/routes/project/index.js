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

const {
  CreateProject,
  UpdateProject,
  GetProjects,
  GetProjectById,
  DeleteProject,
} = require("../../../../../domain/project/useCases");

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

// @route put /update/:id
// @desc Update a project
router.put("/update/:id", async (req, res) => {
  try {
    const token = getTokenFromHeader(req);
    const { name, email, address, clientId, projectCode, ...rest } = req.body;
    if (Object.keys(rest).length > 0) {
      throw new ValidationError("Request body contains unexpected fields.");
    }
    const id = req.params.id;
    const updateProject = new UpdateProject(ProjectDAO);
    const result = await updateProject.execute(
      {
        name,
        email,
        address,
        clientId,
        projectCode,
      },
      id,
      token
    );
    res.status(200).json(result);
  } catch (error) {
    handleError(error, res);
  }
});

// @route GET /getAll/:id
// @desc Get all projects for a client
router.get("/getAll/:id", async (req, res) => {
  try {
    const token = getTokenFromHeader(req);
    const id = req.params.id;
    const getProjects = new GetProjects(ProjectDAO);
    const result = await getProjects.execute(id, token);
    res.status(200).json(result);
  } catch (error) {
    handleError(error, res);
  }
});

// @route GET /get/:id
// @desc Get a project by ID
router.get("/getById/:id", async (req, res) => {
  try {
    const token = getTokenFromHeader(req);
    const clientId = req.params.id;
    const projectId = req.query.pId;
    const getProjects = new GetProjectById(ProjectDAO);
    const result = await getProjects.execute(projectId, token, clientId);
    res.status(200).json(result);
  } catch (error) {
    handleError(error, res);
  }
});

// @route DELETE /delete/:id
// @desc Delete a project by ID (soft/hard delete)
router.delete("/delete/:id", async (req, res) => {
  try {
    const token = getTokenFromHeader(req);
    const id = req.params.id;
    const { clientId, ...rest } = req.body;
    if (!clientId || typeof clientId !== "string") {
      throw new ValidationError("Request body must contain a string called 'clientId'.");
    }
    if (Object.keys(rest).length > 0) {
      throw new ValidationError("Request body contains unexpected fields.");
    }
    const { soft } = req.query;
    if (soft === undefined) {
      throw new ValidationError("Query parameter 'soft' is required.");
    }
    if (soft !== "true" && soft !== "false") {
      throw new ValidationError(
        "Query parameter 'soft' must be 'true' or 'false'."
      );
    }
    const deleteProject = new DeleteProject(ProjectDAO);
    const result = await deleteProject.execute(
      id,
      token,
      clientId,
      soft === "true"
    );
    res.status(200).json(result);
  } catch (error) {
    handleError(error, res);
  }
});

module.exports = router;
