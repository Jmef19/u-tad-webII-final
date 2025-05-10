const { Project } = require("../entities");

const { JWTService } = require("../../../infrastructure/services");

class CreateProject {
  constructor(projectDAO) {
    this.projectDAO = projectDAO;
  }

  async execute({ name, email, address, clientId }, token) {
    const decoded = JWTService.verify(token);
    const project = new Project({
      projectName: name,
      email,
      address,
      clientId,
    });
    project.userId = decoded.id;
    const createdProject = await this.projectDAO.create(project);
    return createdProject;
  }
}

module.exports = CreateProject;
