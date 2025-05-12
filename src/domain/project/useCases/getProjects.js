const { JWTService } = require("../../../infrastructure/services");

class GetProjects {
  constructor(projectDAO) {
    this.projectDAO = projectDAO;
  }

  async execute(clientId, token) {
    const decoded = JWTService.verify(token);
    await this.projectDAO.checkIfUserOwnsClient(clientId, decoded.id);
    const projects = await this.projectDAO.getAll(decoded.id, clientId);
    return projects;
  }
}

module.exports = GetProjects;
