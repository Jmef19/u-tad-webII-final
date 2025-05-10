const { JWTService } = require("../../../infrastructure/services");

const {
  ProjectNotFoundError,
  NotOwnedClientError,
} = require("../../../domain/errors");

class GetProjectById {
  constructor(projectDAO) {
    this.projectDAO = projectDAO;
  }
  async execute(id, token, clientId) {
    const decoded = JWTService.verify(token);
    const userId = decoded.userId;
    const valid = await this.projectDAO.isOwnedByUser(id, userId, clientId);
    if (!valid) {
      const exists = await this.projectDAO.getById(id);
      if (!exists) {
        throw new ProjectNotFoundError("Project not found");
      }
      throw new NotOwnedClientError("Project not owned by user");
    }
    return exists;
  }
}

module.exports = GetProjectById;
