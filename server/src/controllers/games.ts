import { Request, Response } from 'express'
import Game from '../classes/Game'
import { GameMode, GameParticipant } from '../types'
import Player from '../classes/Player'
import Team from '../classes/Team'

export const getGameById = (req: Request, res: Response) => {
  const gameId: number = parseInt(req.params.gameId)
  const game = Game.fetchById(gameId)
  res.json(game)
}

export const createGame = (req: Request, res: Response) => {
  const { gameMode, participants } = req.body
 
  try {
    const game = Game.addTemplate(gameMode, new Date(), participants)
    res.json(game)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: error })
  }
}

export const updateGameTurn = (req: Request, res: Response) => {
  const { entry, wordScore } = req.body
  const gameId = parseInt(req.params.gameId)

  try {
    const gameTemplate = Game.fetchById(gameId)
    gameTemplate.updateTurn(entry, wordScore)
    res.status(200).json({ message: 'Success' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: error })
  }
}

export const finishGame = (req: Request, res: Response) => {
  const gameId = parseInt(req.params.gameId)

  try {
    const game = Game.fetchById(gameId)
    game.finish(new Date())
    res.status(200).json({ message: 'Success' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: error })
  }
}

/*********************
 *    FOR TESTING    *
 *********************/

export const testFunction = (req: Request, res: Response) => {
  console.log('testFunc')

  const player1 = Player.fetchById(1)
  const player2 = Player.fetchById(2)
  const player3 = Player.fetchById(3)
  const player4 = Player.fetchById(4)

  const team1 = Team.fetchById(1)

  const participants: GameParticipant[] = [
    {
      participant: player1,
      isTeam: false,
      score: 0,
      turnsUsed: 0,
      wordsPlayed: [],
    },
    {
      participant: player2,
      isTeam: false,
      score: 0,
      turnsUsed: 0,
      wordsPlayed: [],
    },
    {
      participant: {
        ...team1,
        members: [player3, player4],
      },
      isTeam: true,
      score: 0,
      turnsUsed: 0,
      wordsPlayed: [],
    },
  ]

  const gameTemplate = Game.addTemplate(GameMode.Normal, new Date(), participants)

  res.json(gameTemplate)
}

export const populatePlayers = (req: Request, res: Response) => {
  console.log('populate')

  for (let i = 0; i < 5; i++) {
    Player.create(`Player name ${i}`, `Player ${i}`)
  }
  Team.create('Team 1')

  res.status(200).json({ message: 'Success' })
}
