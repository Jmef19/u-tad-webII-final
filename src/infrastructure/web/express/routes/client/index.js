const { Router } = require("express");

const ClientDAO = require("../../../../persistence/mysql/client/clientDAO");

const { JWTError } = require("../../../../../domain/errors");

const {
  CreateClient,
  GetClients,
  GetClientById,
  UpdateClient,
} = require("../../../../../domain/client/useCases");

const router = Router();

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

// @route POST /api/client
// @desc Create a new client
router.post("/", async (req, res) => {
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
    res.status(201).json(result);
  } catch (error) {
    handleError(error, res);
  }
});

// @route GET /api/client
// @desc Get all clients
router.get("/", async (req, res) => {
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

// @route GET /api/client/:id
// @desc Get a client by ID
router.get("/:id", async (req, res) => {
  try {
    assertEmptyBody(req);
    const token = getTokenFromHeader(req);
    const { id } = req.params;
    const getClientById = new GetClientById(ClientDAO);
    const result = await getClientById.execute(id);
    res.status(200).json(result);
  } catch (error) {
    handleError(error, res);
  }
});
