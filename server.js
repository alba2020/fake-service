// Create express app
var express = require("express")
var app = express()
var usersController = require('./controllers/usersController')

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


var HTTP_PORT = 8000
// Start server
app.listen(HTTP_PORT, () => {
  console.log("Server running on port %PORT%".replace("%PORT%", HTTP_PORT))
})
// Root endpoint
app.get("/", (req, res, next) => {
  res.json({ "message": "Ok" })
})

app.get("/api/users", usersController.index)
app.get("/api/users/:id", usersController.show)
app.post("/api/users/", usersController.create)
app.patch("/api/users/:id", usersController.update)
app.delete("/api/users/:id", usersController.remove)

// ------------ 404 -------------
app.use(function (req, res, next) {
  res.status(404).send("Sorry can't find that!")
})
