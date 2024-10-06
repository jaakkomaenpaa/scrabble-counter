import express from 'express'
import {
  addNewTeam,
  changeTeamName,
  deleteTeam,
  findTeamByMembers,
  getTeamById,
} from '../controllers/teams'

const teamRouter = express.Router()

teamRouter.get('/:teamId', getTeamById)

teamRouter.post('/add', addNewTeam)
teamRouter.post('/find', findTeamByMembers)

teamRouter.put('/change-name/:teamId', changeTeamName)

teamRouter.delete('/delete/:teamId', deleteTeam)

export default teamRouter
