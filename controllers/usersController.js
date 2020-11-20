var md5 = require('md5')
var usersRepository = require('../repositories/usersRepository')

function handleError(res, f) {
  return function (err, rows) {
    if (err) {
      res.status(400).json({ "error": err.message })
      return
    }
    return f(rows)
  }
}

function index(req, res, next) {
  usersRepository.findAll(handleError(res, rows => {
    res.json({
      "message": "success",
      "data": rows
    })
  }))
}


// function index(req, res, next) {
//   usersRepository.findAll((err, rows) => {
//     if (err) {
//       res.status(400).json({ "error": err.message })
//       return
//     }
//     res.json({
//       "message": "success",
//       "data": rows
//     })
//   })
// }

function show(req, res, next) {
  var handler = handleError(res, row => {
    res.json({
      "message": "success",
      "data": row
    })
  })
  usersRepository.find(req.params.id, handler)
}


// function show(req, res, next) {
//   usersRepository.find(req.params.id, (err, row) => {
//     if (err) {
//       res.status(400).json({ "error": err.message })
//       return
//     }
//     res.json({
//       "message": "success",
//       "data": row
//     })
//   })
// }

function create(req, res, next) {
  var errors = []
  if (!req.body.password) {
    errors.push("No password specified")
  }
  if (!req.body.email) {
    errors.push("No email specified")
  }
  if (errors.length) {
    res.status(400).json({ "error": errors.join(", ") })
    return
  }
  var user = {
    name: req.body.name,
    email: req.body.email,
    password: md5(req.body.password)
  }
  usersRepository.create(user, function (err, result) {
    if (err) {
      res.status(400).json({ "error": err.message })
      return
    }
    res.json({
      "message": "success",
      "data": user,
      "id": this.lastID
    })
  })
}

function update(req, res, next) {
  var user = {
    id: req.params.id,
    name: req.body.name,
    email: req.body.email,
    password: req.body.password ? md5(req.body.password) : null
  }
  usersRepository.update(user, function (err, result) {
    if (err) {
      res.status(400).json({ "error": res.message })
      return;
    }
    res.json({
      message: "success",
      data: user,
      changes: this.changes
    })
  })
}

function remove(req, res, next) {
  usersRepository.remove(req.params.id, function (err, result) {
    if (err) {
      res.status(400).json({ "error": res.message })
      return;
    }
    res.json({ "message": "deleted", changes: this.changes })
  })
}

module.exports = {
  index,
  show,
  create,
  update,
  remove
}
