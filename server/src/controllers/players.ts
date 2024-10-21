import { Request, Response } from 'express'
import Player from '../classes/Player'
import { PlayerWithTotalGameStats } from '../types'

export const getAllPlayers = (req: Request, res: Response) => {
  const players = Player.fetchAll()
  res.json(players)
}

export const getPlayerById = (req: Request, res: Response) => {
  const playerId: number = parseInt(req.params.playerId)
  const player = Player.fetchById(playerId)
  res.json(player)
}

export const getTotalPlayerGameStats = (req: Request, res: Response) => {
  const playerId: number = parseInt(req.params.playerId)
  const player = Player.fetchById(playerId)
  const playersWithStats = player.getTotalGameStats()
  res.json(playersWithStats)
}

export const getPlayersWithTotalGameStats = (req: Request, res: Response) => {
  const players = Player.fetchAll()
  const playersWithStats: PlayerWithTotalGameStats[] = players.map(
    (player: Player) => {
      return player.getTotalGameStats()
    }
  )
  res.json(playersWithStats)
}

export const addNewPlayer = (req: Request, res: Response) => {
  const { fullName, displayName } = req.body

  try {
    const player = Player.create(fullName, displayName)
    res.json(player)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: error })
  }
}
