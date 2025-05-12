const { JWTService } = require("../../../infrastructure/services");

class DeleteProject {
  constructor(projectDAO) {
    this.projectDAO = projectDAO;
  }

  // DELETE project based on parameters(soft/hard)
  async execute(id, token, clientId, soft = true) {
    const decoded = JWTService.verify(token);
    const userId = decoded.userId;
    await this.projectDAO.checkIfUserOwnsProject(userId, id, clientId); 
    if (soft) {
      await this.projectDAO.softDelete(id);
    } else {
      await this.projectDAO.hardDelete(id);
    }
  }
}

module.exports = DeleteProject;
