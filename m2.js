// my.js

const AppDAO = require('./dao')
const UserRepository = require('./repositories/user_repository')

function main() {
  const dao = new AppDAO('./users1.sqlite3')
  const userRepo = new UserRepository(dao)

  // userRepo.getById(21)
  userRepo
    .createTable()
    .then(() => userRepo.seed())
    .then(() => userRepo.getById(1))
    .then(user => {
      if (!user) {
        throw 'User not found'
      }
      console.log(`Retreived user from database`)
      console.log(`user id = ${user.id}`)
      console.log(`user name = ${user.name}`)
    })
    .catch(err => {
      console.log('Error: ')
      console.log(JSON.stringify(err))
    })
}

main()
