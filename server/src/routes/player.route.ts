import express from 'express'
import { addNewPlayer, getAllPlayers, getPlayerById } from '../controllers/players'

const playerRouter = express.Router()

playerRouter.get('/', getAllPlayers)
playerRouter.get('/:playerId', getPlayerById)

playerRouter.post('/add', addNewPlayer)

export default playerRouter
