const { JWTService } = require("../../../infrastructure/services");

const {
  ProjectNotFoundError,
  NotOwnedProjectError,
} = require("../../../domain/errors");

class RestoreProject {
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
      throw new NotOwnedProjectError("Project not owned by user");
    }
    return await this.projectDAO.restore(id);
  }
}

module.exports = RestoreProject;
