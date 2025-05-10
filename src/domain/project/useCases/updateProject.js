const { Project } = require("../entities");

const { JWTService } = require("../../../infrastructure/services");

const {
  ProjectNotFoundError,
  NotOwnedProjectError,
} = require("../../../domain/errors");

class UpdateProject {
  constructor(projectDAO) {
    this.projectDAO = projectDAO;
  }

  async execute({ name, email, address, clientId }, id, token) {
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
    const project = new Project({
      projectName: name,
      email,
      address,
      clientId,
    });
    project.userId = userId;
    const updatedProject = await this.projectDAO.update(project);
    return updatedProject;
  }
}

module.exports = UpdateProject;
