import { Request, Response } from 'express'
import Player from '../classes/Player'
import Team from '../classes/Team'

export const getAllPlayers = (req: Request, res: Response) => {
  const players = Player.fetchAll()
  res.json(players)
}

export const getPlayerById = (req: Request, res: Response) => {
  const playerId: number = parseInt(req.params.playerId)
  const player = Player.fetchById(playerId)
  res.json(player)
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


