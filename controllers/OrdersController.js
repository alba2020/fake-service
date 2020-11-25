
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
          "order": order
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
    if (!order) return

    this.repo
      .create(order.link, order.count, order.target)
      .then(data => {
        return this.repo.getById(data.id)
      })
      .then(order => {
        
        let completed = Math.round(order.count * order.target / 100)
        let status = 'STATUS_UNKNOWN'

        setTimeout(() => {
          if (order.target > 0 && order.target < 100) {
            status = 'STATUS_RUNNING'
          } else if (order.target === 100) {
            status = 'STATUS_COMPLETED'
          } else {
            completed = 0
            status = 'STATUS_ERROR'
          }
          console.log(`id ${order.id} [${completed}/${order.count}] -> ${status}`)
          this.repo.update({
            id: order.id,
            completed: completed,
            status: status
          })
        }, 10000)

        res.json({
          "message": "success",
          "order": order,
        })
      })
      .catch(OrdersController.printError(res))
  }

  update(req, res, next) {
    var order = {
      id: req.params.id,
      link: req.body.link,
      count: req.body.count,
      target: req.body.target,
      completed: req.body.completed,
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
