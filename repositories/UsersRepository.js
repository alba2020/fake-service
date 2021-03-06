const md5 = require('md5')

const Repository = require('./Repository')

class UserRepository extends Repository {

  // table = 'users'

  constructor(dao) {
    super()
    this.dao = dao
    this.table = 'users'
  }

  createTable() {
    console.log('creating table users')
    const sql = `
      CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name text, 
      email text UNIQUE, 
      password text,
      created_at DATETIME DEFAULT (datetime('now','localtime')),
      CONSTRAINT email_unique UNIQUE (email))
      `
    return this.dao.run(sql)
  }

  seed() {
    console.log('seeding users')
    const insert = `INSERT INTO users (name, email, password) VALUES (?,?,?)`
    return Promise.all([
      this.dao.run(insert,
        ["admin", "admin@example.com", md5("admin123456")]),
      this.dao.run(insert,
        ["user", "user@example.com", md5("user123456")])
    ])
  }

  create(name, email, password) {
    return this.dao.run(
      `INSERT INTO ${this.table} (name, email, password) VALUES (?,?,?)`,
      [name, email, password]
    )
  }

  update(user) {
    const { id, name, email, password } = user
    return this.dao.run(
      `UPDATE users SET
      name = COALESCE(?, name), 
      email = COALESCE(?, email), 
      password = COALESCE(?, password) 
      WHERE id = ?`,
      [name, email, password, id]
    )
  }

}

module.exports = UserRepository
