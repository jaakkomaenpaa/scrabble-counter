import express from 'express'
import {
  addNewPlayer,
  getAllPlayers,
  getAllPlayerStats,
  getPlayerById,
  getPlayersWithTotalGameStats,
} from '../controllers/players'

const playerRouter = express.Router()

playerRouter.get('/', getAllPlayers)
playerRouter.get('/stats', getPlayersWithTotalGameStats)
playerRouter.get('/stats/:playerId', getAllPlayerStats)
playerRouter.get('/:playerId', getPlayerById)

playerRouter.post('/add', addNewPlayer)

export default playerRouter
