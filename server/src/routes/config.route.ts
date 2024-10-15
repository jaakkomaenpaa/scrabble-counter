import express from 'express'
import {
  clearDatabase,
  createDatabase,
  deleteDatabase,
  initDatabase,
  updateDatabase,
} from '../controllers/config'

const configRouter = express.Router()

configRouter.get('/create-db/:dbName', createDatabase)
configRouter.get('/init-db/:dbName', initDatabase)
configRouter.get('/clear-db/:dbName', clearDatabase)
configRouter.get('/delete-db/:dbName', deleteDatabase)
configRouter.get('/update-db/:dbName', updateDatabase)

export default configRouter
