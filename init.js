// my.js

const Promise = require('bluebird')
const AppDAO = require('./dao')
const OrdersRepository = require('./repositories/order_repository')

function init() {
  const dao = new AppDAO('./users1.sqlite3')
  const ordersRepo = new OrdersRepository(dao)

  // userRepo.getById(21)
  ordersRepo
    .createTable()
    .then(() => ordersRepo.seed())
    .then(() => ordersRepo.getById(1))
    .then(order => {
      if (!order) {
        throw 'Order not found'
      }
      console.log(`Retreived order from database`)
      console.log(JSON.stringify(order))
    })
    .catch(err => {
      console.log('Error: ')
      console.log(JSON.stringify(err))
    })
}

init()
