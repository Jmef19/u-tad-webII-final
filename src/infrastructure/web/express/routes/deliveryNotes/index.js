const { Router } = require("express");

const DeliveryNoteDAO = require("../../../../persistence/mysql/deliveryNote/deliveryNoteDAO");

const {
  JWTError,
  ValidationError,
  DeliveryNoteExistingError,
  ClientNotFoundError,
  NotOwnedClientError,
  DatabaseConnectionError,
  DatabaseQueryError,
  AlreadyExistsError,
  UserNotFoundError,
  ProjectNotFoundError,
  DNotesNotFoundError,
} = require("../../../../../domain/errors");

const {
  CreateDeliveryNote,
} = require("../../../../../domain/deliveryNote/useCases");
const GetDNotes = require("../../../../../domain/deliveryNote/useCases/getDNotes");

const router = Router();

function handleError(error, res) {
  if (error instanceof JWTError) {
    res.status(401).json({ error: error.message });
  } else if (error instanceof ValidationError) {
    res.status(422).json({ error: error.message });
  } else if (
    error instanceof ClientNotFoundError ||
    error instanceof UserNotFoundError ||
    error instanceof ProjectNotFoundError ||
    error instanceof DNotesNotFoundError
  ) {
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

// @route POST /create
// @desc Create a new delivery note
router.post("/create", async (req, res) => {
  try {
    const token = getTokenFromHeader(req);
    const {
      clientId,
      projectId,
      format,
      material,
      hours,
      description,
      ...rest
    } = req.body;
    if (Object.keys(rest).length > 0) {
      throw new ValidationError("Request body contains unexpected fields.");
    }
    const createDeliveryNote = new CreateDeliveryNote(DeliveryNoteDAO);
    const result = await createDeliveryNote.execute(
      {
        clientId,
        projectId,
        format,
        material,
        hours,
        description,
      },
      token
    );
    res.status(200).json(result);
  } catch (error) {
    handleError(error, res);
  }
});

// @route GET /get
// @desc Get all delivery notes for a specific client and project
router.get("/get", async (req, res) => {
  try {
    const token = getTokenFromHeader(req);
    const { clientId, projectId } = req.query;
    if (!clientId || !projectId) {
      throw new ValidationError(
        "ClientId and ProjectId are required in query params."
      );
    }
    const getDeliveryNotes = new GetDNotes(DeliveryNoteDAO);
    const result = await getDeliveryNotes.execute(token, clientId, projectId);
    res.status(200).json(result);
  } catch (error) {
    handleError(error, res);
  }
});

module.exports = router;
