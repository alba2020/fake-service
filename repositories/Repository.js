
class Repository {

  getAll() {
    return this.dao.all(`SELECT * FROM ${this.table}`)
  }

  getById(id) {
    return this.dao.get(
      `SELECT * FROM ${this.table} WHERE id = ?`,
      [id]
    )
  }

  delete(id) {
    return this.dao.run(
      `DELETE FROM ${this.table} WHERE id = ?`,
      [id]
    )
  }

}

module.exports = Repository
