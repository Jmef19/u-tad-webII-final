const { JWTService } = require("../../../infrastructure/services");

class GetProjectById {
  constructor(projectDAO) {
    this.projectDAO = projectDAO;
  }
  async execute(id, token, clientId) {
    const decoded = JWTService.verify(token);
    const userId = decoded.id;
    await this.projectDAO.checkIfUserOwnsProject(userId, id, clientId);
    return await this.projectDAO.getById(id);
  }
}

module.exports = GetProjectById;
