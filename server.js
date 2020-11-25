// Create express app
const express = require("express")
const bodyParser = require("body-parser");

const AppDAO = require('./dao')

const UsersRepository = require('./repositories/UsersRepository')
const UsersController = require('./controllers/UsersController')
const OrdersRepository = require('./repositories/OrdersRepository')
const OrdersController = require('./controllers/OrdersController')

const app = express()
const HTTP_PORT = 8000

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.listen(HTTP_PORT, () => {
  console.log("Server running on port %PORT%".replace("%PORT%", HTTP_PORT))
})

app.get("/", (req, res, next) => {
  res.json({ "message": "Ok" })
})

const dao = new AppDAO('./users1.sqlite3')
const usersRepo = new UsersRepository(dao)
const usersController = new UsersController(usersRepo)

app.get("/api/users", usersController.index)
app.get("/api/users/:id", usersController.show)
app.post("/api/users/", usersController.create)
app.patch("/api/users/:id", usersController.update)
app.delete("/api/users/:id", usersController.delete)

const ordersRepo = new OrdersRepository(dao)
const ordersCtrl = new OrdersController(ordersRepo)

app.get("/api/orders", ordersCtrl.index)
app.get("/api/orders/:id", ordersCtrl.show)
app.post("/api/orders/", ordersCtrl.create)
app.patch("/api/orders/:id", ordersCtrl.update)
app.delete("/api/orders/:id", ordersCtrl.delete)

// ------------ 404 -------------
app.use(function (req, res, next) {
  res.status(404).send("Sorry can't find that!")
})
