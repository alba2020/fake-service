// init.js

const AppDAO = require('./dao')
const OrdersRepository = require('./repositories/OrdersRepository')

function init() {
  const dao = new AppDAO('./db.sqlite3')
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
