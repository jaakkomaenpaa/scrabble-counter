import { Request, Response } from 'express'
import Team from '../classes/Team'

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

export const findTeamByMembers = (req: Request, res: Response) => {
  const { players } = req.body

  try {
    const team = Team.findByMembers(players)
    console.log('team', team)
    
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
