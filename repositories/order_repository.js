
class OrderRepository {

  constructor(dao) {
    this.dao = dao
  }

  createTable() {
    console.log('creating table orders');

    const sql = `
        CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        link text,
        count integer,
        status string,
        created_at DATETIME DEFAULT (datetime('now','localtime')),
        `
    return this.dao.run(sql)
  }

  seed() {
    console.log('seeding orders');
    const insert = `
    INSERT INTO orders(link, count) VALUES (?, ?)`
    return Promise.all([
      this.dao.run(insert,
        ['https://instagram.com/1', 100]),
      this.dao.run(insert,
        ['https://instagram.com/2', 200]),
    ])
  }

  getById(id) {
    return this.dao.get(
      `SELECT * FROM orders WHERE id = ?`,
      [id]
    )
  }

}