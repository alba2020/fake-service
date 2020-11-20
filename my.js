// my.js

const Promise = require('bluebird')
const AppDAO = require('./dao')
const ProjectRepository = require('./repositories/project_repository')
const TaskRepository = require('./repositories/task_repository')

function main() {
  const dao = new AppDAO('./database.sqlite3')
  const projectRepo = new ProjectRepository(dao)
  const taskRepo = new TaskRepository(dao)

  projectRepo.getById(4)
    .then(project => {
      if (!project) {
        throw 'Project not found'
      }
      console.log(`\nRetreived project from database`)
      console.log(`project id = ${project.id}`)
      console.log(`project name = ${project.name}`)
    })
    .catch(err => {
      console.log('Error: ')
      console.log(JSON.stringify(err))
    })
}

main()
