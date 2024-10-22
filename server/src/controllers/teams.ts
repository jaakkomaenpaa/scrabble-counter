import { Request, Response } from 'express'
import Team from '../classes/Team'
import { TeamWithAllStats, TeamWithTotalGameStats, WordScoreApi } from '../types'

export const getTeamById = (req: Request, res: Response) => {
  const teamId: number = parseInt(req.params.teamId)
  const team = Team.fetchById(teamId)
  res.json(team)
}

export const addNewTeam = (req: Request, res: Response) => {
  const { teamName } = req.body

  try {
    const team = Team.create(teamName)
    res.json(team)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: error })
  }
}

export const getAllTeamStats = (req: Request, res: Response) => {
  const teamId: number = parseInt(req.params.teamId)
  const team = Team.fetchById(teamId)

  const teamWithGameStats: TeamWithTotalGameStats = team.getTotalGameStats()
  const words: WordScoreApi[] = team.getAllWords()

  const teamWithAllStats = {
    ...teamWithGameStats,
    allWords: words.slice(0, 10),
  } as TeamWithAllStats

  res.json(teamWithAllStats)
}

export const getTotalTeamGameStats = (req: Request, res: Response) => {
  const teams = Team.fetchAll()
  const teamsWithStats: TeamWithTotalGameStats[] = teams.map((team: Team) => {
    return team.getTotalGameStats()
  })
  res.json(teamsWithStats)
}

export const findTeamByMembers = (req: Request, res: Response) => {
  const { players } = req.body

  try {
    const team = Team.findByMembers(players)
    res.json(team) // May be null
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: error })
  }
}

export const changeTeamName = (req: Request, res: Response) => {
  const { newName } = req.body
  const teamId: number = parseInt(req.params.teamId)

  try {
    const team = Team.fetchById(teamId)
    const updatedTeam = team.changeName(newName)
    res.json(updatedTeam)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: error })
  }
}

export const deleteTeam = (req: Request, res: Response) => {
  const teamId: number = parseInt(req.params.teamId)

  try {
    Team.deleteFromDb(teamId)
    res.status(200).json({ message: 'Success' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: error })
  }
}
