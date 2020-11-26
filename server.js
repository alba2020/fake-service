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

const server = app.listen(HTTP_PORT, () => {
  console.log("Server running on port %PORT%".replace("%PORT%", HTTP_PORT))
})

app.get("/", (req, res, next) => {
  res.json({ "message": "Ok" })
})

const dao = new AppDAO('./db.sqlite3')
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


// The signals we want to handle
// NOTE: although it is tempting, the SIGKILL signal (9) cannot be intercepted and handled
var signals = {
  'SIGHUP': 1,
  'SIGINT': 2,
  'SIGTERM': 15
};
// Do any necessary shutdown logic for our application here
const shutdown = (signal, value) => {
  console.log("shutdown!");
  server.close(() => {
    console.log(`server stopped by ${signal} with value ${value}`);
    process.exit(128 + value);
  });
};

// Create a listener for each of the signals that we want to handle
Object.keys(signals).forEach((signal) => {
  process.on(signal, () => {
    console.log(`process received a ${signal} signal`);
    shutdown(signal, signals[signal]);
  });
});