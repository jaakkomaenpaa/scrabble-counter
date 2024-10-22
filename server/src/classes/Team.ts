import { DB } from '../config'
import {
  selectTeamByMembers,
  selectTeamMembers,
  selectTeamStatusByGame,
  selectTotalTeamGameStats,
} from '../queries/playerGames'
import {
  selectAllTeamWords,
  selectTeamWordsByGame,
  selectTotalTeamWords,
} from '../queries/playerWords'
import {
  deleteTeam,
  insertTeam,
  selectAllTeams,
  selectTeamById,
  updateTeamName,
} from '../queries/teams'
import { PlayerGameStatus, TeamWithTotalGameStats, WordScoreApi } from '../types'
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

  public static fetchAll(): Team[] {
    const rows = DB.prepare(selectAllTeams).all() as Team[]

    if (!rows) {
      throw new Error('Teams not found')
    }

    return rows.map((row) => this.createFromRow(row))
  }

  /* Find team by its members; return null if doesn't exist */
  public static findByMembers(players: Player[]): Team | null {
    if (players.length === 0) {
      return null
    }

    const placeholders = players.map(() => '?').join(', ')
    const playerIds = players.map((player) => player.id)

    const queryParams = [...playerIds, playerIds.length]
    const query = selectTeamByMembers(placeholders)

    const row = DB.prepare(query).get(queryParams) as { teamId: number }

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

    const players: Player[] = rows.map((row) => Player.fetchById(row.playerId))

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

  // Get all stats: words, scores, etc.
  public getTotalGameStats(): TeamWithTotalGameStats {
    const gameRow = DB.prepare(selectTotalTeamGameStats).get(this.id) as {
      totalScore: number
      totalGames: number
      totalTurnsUsed: number
    }
    const wordRow = DB.prepare(selectTotalTeamWords).get(this.id) as {
      totalWords: number
    }

    if (!gameRow || !wordRow) {
      return {
        ...this,
        totalScore: 0,
        totalGames: 0,
        totalTurnsUsed: 0,
        totalWords: 0,
        avgGameScore: 0,
        avgWordScore: 0,
        avgWordsPlayed: 0,
      } as TeamWithTotalGameStats
    }

    const stats = {
      ...this,
      ...gameRow,
      ...wordRow,
      avgGameScore: gameRow.totalScore / gameRow.totalGames || 0,
      avgWordScore: gameRow.totalScore / wordRow.totalWords || 0,
      avgWordsPlayed: wordRow.totalWords / gameRow.totalGames || 0,
    } as TeamWithTotalGameStats

    return stats
  }

  public getAllWords(): WordScoreApi[] {
    const rows = DB.prepare(selectAllTeamWords).all(this.id) as WordScoreApi[]

    if (!rows) {
      return []
    }

    return rows
  }
}
