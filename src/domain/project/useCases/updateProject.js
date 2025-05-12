const { Project } = require("../entities");

const { JWTService } = require("../../../infrastructure/services");

class UpdateProject {
  constructor(projectDAO) {
    this.projectDAO = projectDAO;
  }

  async execute({ name, email, address, clientId, projectCode }, id, token) {
    const decoded = JWTService.verify(token);
    const userId = decoded.id;
    await this.projectDAO.checkIfUserOwnsProject(userId, id, clientId);
    const project = new Project({
      name,
      email,
      address,
      clientId,
      projectCode,
    });
    project.userId = userId;
    await this.projectDAO.findByProjectCode(projectCode);
    await this.projectDAO.update(project, id);
    return await this.projectDAO.getById(id);
  }
}

module.exports = UpdateProject;
