
const Repository = require('./Repository')

class OrdersRepository extends Repository {

  constructor(dao) {
    super()
    this.dao = dao
    this.table = 'orders'
  }

  createTable() {
    console.log('creating table orders');

    const sql = `
        CREATE TABLE IF NOT EXISTS ${this.table} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        link text,
        count integer,
        target integer,
        completed integer default 0,
        status string default 'STATUS_CREATED',
        created_at DATETIME DEFAULT (datetime('now','localtime'))
        )`
    return this.dao.run(sql)
  }

  seed() {
    console.log('seeding orders');
    return Promise.all([
      this.create('https://instagram.com/1', 100, 100),
      this.create('https://instagram.com/2', 200, 50),
    ])
  }

  create(link, count, target) {
    return this.dao.run(
      `INSERT INTO orders (link, count, target)
       VALUES (?,?,?)`,
      [link, count, target]
    )
  }

  setStatus(id, newStatus) {
    return this.dao.run(
      `UPDATE ${this.table} SET status = ? WHERE id = ?`,
      [newStatus, id]
    )
  }

  update(order) {
    const { id, link, count, target, completed, status } = order
    return this.dao.run(
      `UPDATE orders SET
      link = COALESCE(?, link), 
      count = COALESCE(?, count),
      target = COALESCE(?, target),
      completed = COALESCE(?, completed),
      status = COALESCE(?, status) 
      WHERE id = ?`,
      [link, count, target, completed, status, id]
    )
  }

}

module.exports = OrdersRepository
