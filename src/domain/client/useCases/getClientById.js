class GetClientById {
  constructor(clientDAO) {
    this.clientDAO = clientDAO;
  }

  async execute(id) {
    const client = await this.clientDAO.getById(id);
    return client;
  }
}
module.exports = GetClientById;
