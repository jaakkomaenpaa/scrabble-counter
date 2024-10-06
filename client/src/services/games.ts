import axios from 'axios'
import { BASE_API_URL } from '../config'
import { Game, GameMode, GameParticipant, WordScoreApi } from '../types'

const baseUrl = `${BASE_API_URL}/games`

const findById = async (gameId: string | number): Promise<Game | null> => {
  try {
    const response = await axios.get(`${baseUrl}/${gameId}`)
    const game: Game = response.data

    game.startDate = new Date(game.startDate)

    if (game.endDate) {
      game.endDate = new Date(game.endDate)
    }

    return game
  } catch (error) {
    console.error(error)
    return null
  }
}

const create = async (
  gameMode: GameMode,
  participants: GameParticipant[]
): Promise<Game> => {
  const body = {
    gameMode,
    participants,
  }

  const response = await axios.post(`${baseUrl}/create`, body)
  return response.data
}

const updateTurn = async (
  entry: GameParticipant,
  wordScore: WordScoreApi,
  gameId: string | number
): Promise<void> => {
  const body = { entry, wordScore }

  const response = await axios.post(`${baseUrl}/update-turn/${gameId}`, body)
  return response.data
}

const finish = async (gameId: string | number): Promise<Game> => {
  const response = await axios.post(`${baseUrl}/finish/${gameId}`)
  return response.data
}

const exports = {
  findById,
  create,
  updateTurn,
  finish
}

export default exports
