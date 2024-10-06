import { DB } from '../config'
import {
  selectTeamByMembers,
  selectTeamMembers,
  selectTeamStatusByGame,
} from '../queries/playerGames'
import { selectTeamWordsByGame } from '../queries/playerWords'
import {
  deleteTeam,
  insertTeam,
  selectTeamById,
  updateTeamName,
} from '../queries/teams'
import { PlayerGameStatus, WordScoreApi } from '../types'
import Player from './Player'

export default class Team {
  constructor(
    public id: number,
    public name: string,
    public members: Player[] = []
  ) {}

  /* Create team instance from database row */
  public static createFromRow(row: any): Team {
    const team = new Team(row.id, row.name)
    team.getMembers()
    return team
  }

  /* Create and insert a team */
  public static create(name: string): Team {
    const insert = DB.prepare(insertTeam).run(name)

    if (insert.changes === 0) {
      throw new Error(`Could not create team with name ${name}`)
    }

    return this.fetchById(insert.lastInsertRowid as number)
  }

  /* Find team by id */
  public static fetchById(id: number): Team {
    const row = DB.prepare(selectTeamById).get(id)

    if (!row) {
      throw new Error(`Could not find team with id ${id}`)
    }

    return this.createFromRow(row)
  }

  /* Find team by its members; return null if doesn't exist */
  public static findByMembers(players: Player[]): Team | null {
    const placeholders = players.map(() => '?').join(', ')
    const playerIds = players.map(player => player.id)

    const row = DB.prepare(selectTeamByMembers(placeholders)).get(
      playerIds,
      playerIds.length
    ) as { teamId: number }

    if (!row || !row.teamId) {
      return null
    }

    return this.fetchById(row.teamId)
  }

  /* Delete team from database */
  public static deleteFromDb(id: number): void {
    const deletion = DB.prepare(deleteTeam).run(id)

    if (deletion.changes === 0) {
      throw new Error(`Deleting team with id ${id} failed`)
    }
  }

  /* Change name of team */
  public changeName(newName: string): Team {
    const update = DB.prepare(updateTeamName).run(newName, this.id)

    if (update.changes === 0) {
      throw new Error(`Updating name for team with id ${this.id} failed`)
    }

    this.name = newName
    return this
  }

  /* Get the members of team */
  public getMembers(): Player[] {
    const rows = DB.prepare(selectTeamMembers).all(this.id) as { playerId: number }[]

    if (!rows) {
      return []
    }

    const players: Player[] = rows.map(row => Player.fetchById(row.playerId))

    this.members = players
    return players
  }

  /* Get the words a team has played in a game */
  public getWordsForGame(gameId: number): WordScoreApi[] {
    const rows = DB.prepare(selectTeamWordsByGame).all(
      gameId,
      this.id
    ) as WordScoreApi[]

    if (!rows) {
      throw new Error(
        `Could not find stats for team id ${this.id} and game id ${gameId}`
      )
    }
    
    return rows
  }

  /* Get team's game status (score and turns used) */
  public getGameStatus(gameId: number): PlayerGameStatus {
    const row = DB.prepare(selectTeamStatusByGame).get(
      gameId,
      this.id
    ) as PlayerGameStatus

    if (!row) {
      throw new Error(
        `Could not get status for team id ${this.id} and game id ${gameId}`
      )
    }

    return row
  }
}
