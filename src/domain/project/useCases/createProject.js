const { Project } = require("../entities");

const { JWTService } = require("../../../infrastructure/services");

class CreateProject {
  constructor(projectDAO) {
    this.projectDAO = projectDAO;
  }

  async execute({ name, email, address, clientId, projectCode }, token) {
    const decoded = JWTService.verify(token);
    const project = new Project({
      name,
      email,
      address,
      clientId,
      projectCode,
    });
    project.userId = decoded.id;
    await this.projectDAO.checkIfUserOwnsClient(
      project.clientId,
      project.userId
    );
    await this.projectDAO.checkIfProjectExists(project.projectCode);
    const createdProject = await this.projectDAO.create(project);
    return createdProject;
  }
}

module.exports = CreateProject;
