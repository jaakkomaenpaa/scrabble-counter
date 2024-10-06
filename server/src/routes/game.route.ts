import express from 'express'
import {
  createGame,
  finishGame,
  getGameById,
  populatePlayers,
  testFunction,
  updateGameTurn,
} from '../controllers/games'

const gameRouter = express.Router()

gameRouter.get('/:gameId', getGameById)

gameRouter.post('/create', createGame)
gameRouter.post('/update-turn/:gameId', updateGameTurn)
gameRouter.post('/finish/:gameId', finishGame)

// Just for testing
gameRouter.get('/test/addgame', testFunction)
gameRouter.get('/test/populate', populatePlayers)

export default gameRouter
