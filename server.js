// Create express app
const express = require("express")
const bodyParser = require("body-parser");

const Promise = require('bluebird')
const AppDAO = require('./dao')

const UserRepository = require('./repositories/user_repository')
const UsersController = require('./controllers/usersController')

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
const usersRepo = new UserRepository(dao)
const usersController = new UsersController(usersRepo)

app.get("/api/users", usersController.index)
app.get("/api/users/:id", usersController.show)
app.post("/api/users/", usersController.create)
app.patch("/api/users/:id", usersController.update)
app.delete("/api/users/:id", usersController.delete)

// ------------ 404 -------------
app.use(function (req, res, next) {
  res.status(404).send("Sorry can't find that!")
})
