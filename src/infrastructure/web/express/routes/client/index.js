const { Router } = require("express");

const ClientDAO = require("../../../../persistence/mysql/client/clientDAO");

const {
  JWTError,
  DeliveryNoteExistingError,
  ValidationError,
  ClientNotFoundError,
  NotOwnedClientError,
  DatabaseConnectionError,
  DatabaseQueryError,
  AlreadyExistsError,
} = require("../../../../../domain/errors");

const {
  CreateClient,
  GetClients,
  GetClientById,
  UpdateClient,
  DeleteClient,
  RestoreClient,
} = require("../../../../../domain/client/useCases");

const router = Router();

function handleError(error, res) {
  if (error instanceof JWTError) {
    res.status(401).json({ error: error.message });
  } else if (error instanceof ValidationError) {
    res.status(422).json({ error: error.message });
  } else if (error instanceof ClientNotFoundError) {
    res.status(404).json({ error: error.message });
  } else if (
    error instanceof NotOwnedClientError ||
    error instanceof DeliveryNoteExistingError
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

// @route POST /
// @desc Create a new client
router.post("/create", async (req, res) => {
  try {
    const token = getTokenFromHeader(req);
    const { name, CIF, address, ...rest } = req.body;
    if (Object.keys(rest).length > 0) {
      throw new ValidationError("Request body contains unexpected fields.");
    }
    const createClient = new CreateClient(ClientDAO);
    const result = await createClient.execute(
      {
        name,
        CIF,
        address,
      },
      token
    );
    res.status(200).json(result);
  } catch (error) {
    handleError(error, res);
  }
});

// @route GET /
// @desc Get all clients
router.get("/getAll", async (req, res) => {
  try {
    assertEmptyBody(req);
    const token = getTokenFromHeader(req);
    const getClients = new GetClients(ClientDAO);
    const result = await getClients.execute(token);
    res.status(200).json(result);
  } catch (error) {
    handleError(error, res);
  }
});

// @route PUT /:id
// @desc Update a client by ID
router.put("/:id", async (req, res) => {
  try {
    const token = getTokenFromHeader(req);
    const { id } = req.params;
    const { name, CIF, address, ...rest } = req.body;
    if (Object.keys(rest).length > 0) {
      throw new ValidationError("Request body contains unexpected fields.");
    }
    const updateClient = new UpdateClient(ClientDAO);
    const result = await updateClient.execute(
      {
        name,
        CIF,
        address,
      },
      id,
      token
    );
    res.status(200).json(result);
  } catch (error) {
    handleError(error, res);
  }
});

// @route GET /:id
// @desc Get a client by ID
router.get("/:id", async (req, res) => {
  try {
    assertEmptyBody(req);
    const token = getTokenFromHeader(req);
    const { id } = req.params;
    const getClientById = new GetClientById(ClientDAO);
    const result = await getClientById.execute(id, token);
    res.status(200).json(result);
  } catch (error) {
    handleError(error, res);
  }
});

// @route DELETE /:id
// @desc Delete a client by ID based on parameters(soft/hard)
router.delete("/:id", async (req, res) => {
  try {
    assertEmptyBody(req);
    const token = getTokenFromHeader(req);
    const { id } = req.params;
    const { soft } = req.query;
    if (soft === undefined) {
      throw new ValidationError("Query parameter 'soft' is required.");
    }
    if (soft !== "true" && soft !== "false") {
      throw new ValidationError(
        "Query parameter 'soft' must be 'true' or 'false'."
      );
    }
    const deleteClient = new DeleteClient(ClientDAO);
    await deleteClient.execute(id, token, soft === "true");
    res.status(204).send();
  } catch (error) {
    handleError(error, res);
  }
});

// @route PUT /restore/:id
// @desc Restore a soft-deleted client by ID
router.put("/restore/:id", async (req, res) => {
  try {
    assertEmptyBody(req);
    const token = getTokenFromHeader(req);
    const { id } = req.params;
    const restoreClient = new RestoreClient(ClientDAO);
    await restoreClient.execute(id, token);
    res.status(204).send();
  } catch (error) {
    handleError(error, res);
  }
});

module.exports = router;
