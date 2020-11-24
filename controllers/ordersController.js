
class OrdersController {

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
    this.repo.getAll().then(orders => {
      res.json({
        "message": "success",
        "data": orders
      })
    })
      .catch(UsersController.printError(res))
  }

  show(req, res, next) {
    this.repo.getById(req.params.id)
      .then(order => {
        if (!order) {
          throw new Error('Order not found')
        }
        res.json({
          "message": "success",
          "data": order
        })
      })
      .catch(UsersController.printError(res))
  }

  create(req, res, next) {
    var errors = []
    if (!req.body.link) {
      errors.push("No link specified")
    }
    if (!req.body.count) {
      errors.push("No count specified")
    }
    if (errors.length) {
      res.status(400).json({ "error": errors.join(", ") })
      return
    }

    const order = {
      link: req.body.link,
      count: req.body.count,
    }

    this.repo.create(order.link, order.count)
      .then(data => {
        res.json({
          "message": "success",
          "data": order,
          "id": data.id
        })
      })
      .catch(UsersController.printError(res))
  }

  update(req, res, next) {
    var order = {
      id: req.params.id,
      link: req.body.link,
      count: req.body.count,
      status: req.body.status
    }
    this.repo.update(order)
      .then(data => {
        res.json({
          message: "success",
          data: order,
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

module.exports = OrdersController
