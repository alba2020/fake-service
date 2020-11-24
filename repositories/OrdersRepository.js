
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
        CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        link text,
        count integer,
        status string,
        created_at DATETIME DEFAULT (datetime('now','localtime'))
        )`
    return this.dao.run(sql)
  }

  seed() {
    console.log('seeding orders');
    return Promise.all([
      this.create('https://instagram.com/1', 100),
      this.create('https://instagram.com/2', 200),
    ])
  }

  create(link, count) {
    return this.dao.run(
      `INSERT INTO orders (link, count, status) VALUES (?,?,?)`,
      [link, count, 'STATUS_CREATED']
    )
  }

  setStatus(id, newStatus) {
    return this.dao.run(
      `UPDATE ${this.table} SET status = ? WHERE id = ?`,
      [newStatus, id]
    )
  }

  update(order) {
    const { id, link, count, status } = order
    return this.dao.run(
      `UPDATE orders SET
      link = COALESCE(?, link), 
      count = COALESCE(?, count), 
      status = COALESCE(?, status) 
      WHERE id = ?`,
      [link, count, status, id]
    )
  }

}

module.exports = OrdersRepository
