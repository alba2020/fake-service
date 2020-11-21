var md5 = require('md5')

class UsersController {

  constructor(repo) {
    this.repo = repo
    this.index = this.index.bind(this)
    this.show = this.show.bind(this)
    this.create = this.create.bind(this)
    this.update = this.update.bind(this)
    this.delete = this.delete.bind(this)
  }

  static printError(res) {
    return err => {
      console.log('Error: ')
      console.log(JSON.stringify(err))
      res.status(400).json({ "error": err.message })
    }
  }

  index(req, res, next) {
    this.repo.getAll().then(users => {
      res.json({
        "message": "success",
        "data": users
      })
    })
      .catch(UsersController.printError(res))
  }

  show(req, res, next) {
    this.repo.getById(req.params.id)
      .then(user => {
        if (!user) {
          throw new Error('User not found')
        }
        res.json({
          "message": "success",
          "data": user
        })
      })
      .catch(UsersController.printError(res))
  }

  create(req, res, next) {
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

    const user = {
      name: req.body.name,
      email: req.body.email,
      password: md5(req.body.password)
    }

    this.repo.create(user.name, user.email, user.password)
      .then(data => {
        res.json({
          "message": "success",
          "data": user,
          "id": data.id
        })
      })
      .catch(UsersController.printError(res))
  }

  update(req, res, next) {
    var user = {
      id: req.params.id,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password ? md5(req.body.password) : null
    }
    this.repo.update(user)
      .then(data => {
        res.json({
          message: "success",
          data: user,
          changes: data.changes
        })
      })
      .catch(UsersController.printError(res))
  }

  delete(req, res, next) {
    this.repo.delete(req.params.id)
      .then(data => {
        res.json({
          "message": "deleted",
          changes: data.changes
        })
      })
      .catch(UsersController.printError(res))
  }
}

module.exports = UsersController
