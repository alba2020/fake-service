var db = require("../database.js")

function findAll(callback) {
  var sql = "select * from user"
  var params = []
  db.all(sql, params, callback)
}

function find(id, callback) {
  var sql = "select * from user where id = ?"
  var params = [id]
  db.get(sql, params, callback)
}

function create(user, cb) {
  var sql = 'INSERT INTO user (name, email, password) VALUES (?,?,?)'
  var params = [user.name, user.email, user.password]
  db.run(sql, params, cb)
}

function update(user, cb) {
  var sql = `UPDATE user set 
             name = COALESCE(?,name), 
             email = COALESCE(?,email), 
             password = COALESCE(?,password) 
             WHERE id = ?`
  var params = [
    user.name,
    user.email,
    user.password,
    user.id
  ]
  db.run(sql, params, cb)
}

function remove(id, cb) {
  let sql = 'DELETE FROM user WHERE id = ?'
  db.run(sql, id, cb)
}

module.exports = {
  findAll,
  find,
  create,
  update,
  remove
}
