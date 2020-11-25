
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
      .catch(OrdersController.printError(res))
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
      .catch(OrdersController.printError(res))
  }

  getValidatedData(req, res) {
    var errors = []
    if (!req.body.link) {
      errors.push("No link specified")
    }
    if (!req.body.count) {
      errors.push("No count specified")
    }
    if (!req.body.target) {
      errors.push("No target specified")
    }
    if (errors.length) {
      res.status(400).json({ "error": errors.join(", ") })
      return null
    }
    return {
      link: req.body.link,
      count: req.body.count,
      target: req.body.target
    }
  }

  create(req, res, next) {
    const order = this.getValidatedData(req, res)
    if (! order) return

    this.repo.create(order.link, order.count, order.target)
      .then(data => {
        return this.repo.getById(data.id)
      })
      .then(order => {
        // todo
        setTimeout(() => {
          console.log(`Order ${order.id} -> STATUS_COMPLETED`)
          this.repo.setStatus(order.id, 'STATUS_COMPLETED')
        }, 10000)

        res.json({
          "message": "success",
          "data": order,
        })
      })
      .catch(OrdersController.printError(res))
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
      .catch(OrdersController.printError(res))
  }

  delete(req, res, next) {
    this.repo.delete(req.params.id)
      .then(data => {
        res.json({
          "message": "deleted",
          changes: data.changes
        })
      })
      .catch(OrdersController.printError(res))
  }

}

module.exports = OrdersController
