import { DB } from '../config'
import {
  insertPlayer,
  selectAllPlayers,
  selectPlayerByDispName,
  selectPlayerById,
} from '../queries/players'
import { insertPlayerToGame, selectPlayerStatusByGame } from '../queries/playerGames'
import { selectPlayerWordsByGame } from '../queries/playerWords'
import { PlayerGameStatus, WordScoreApi } from '../types'

export default class Player {
  constructor(
    public id: number,
    public fullName: string,
    public displayName: string,

    public totalScore: number = 0,
    public totalGames: number = 0,
    public totalWordsPlayed: number = 0,
    public wordList: WordScoreApi[] = []
  ) {}

  /* Create player instance from database row */
  public static createFromRow(row: any): Player {
    const player = new Player(row.id, row.fullName, row.displayName)

    if (Object.values(player).some(value => value === undefined)) {
      // Warn and continue
      console.error(`Created player with id ${row.id} has undefined fields`)
    }

    return player
  }

  /* Create and insert player */
  public static create(fullName: string, displayName: string): Player {
    const insert = DB.prepare(insertPlayer).run(fullName, displayName)
    if (insert.changes === 0) {
      throw new Error(`Adding player ${displayName} failed`)
    }

    return this.fetchById(insert.lastInsertRowid as number)
  }

  /* Get all players */
  public static fetchAll(): Player[] {
    const rows = DB.prepare(selectAllPlayers).all() as Player[]

    if (!rows) {
      throw new Error('Players not found')
    }

    return rows.map(row => this.createFromRow(row))
  }

  /* Get single player with id */
  public static fetchById(id: number): Player {
    const row = DB.prepare(selectPlayerById).get(id) as Player

    if (!row) {
      throw new Error(`Player with id ${id} not found`)
    }

    return this.createFromRow(row)
  }

  /* Get single player with username */
  public static fetchByDisplayName(displayName: string): Player {
    const row = DB.prepare(selectPlayerByDispName).get(displayName) as Player

    if (!row) {
      throw new Error(`Player with id ${displayName} not found`)
    }

    return this.createFromRow(row)
  }

  /* Add a player to a game */
  public addToGame(gameId: number, teamId?: number): void {
    const insert = DB.prepare(insertPlayerToGame).run(
      this.id,
      gameId,
      0,
      0,
      teamId || null
    )

    if (insert.changes === 0) {
      throw new Error(
        `Could not add player with id ${this.id} to game with id ${gameId}`
      )
    }
  }

  /* Get the words a player has played in a game */
  public getWordsForGame(gameId: number): WordScoreApi[] {
    const rows = DB.prepare(selectPlayerWordsByGame).all(
      gameId,
      this.id
    ) as WordScoreApi[]

    if (!rows) {
      throw new Error(
        `Could not find stats for player id ${this.id} and game id ${gameId}`
      )
    }

    this.wordList = rows
    return rows
  }

  /* Get player's game status (score and turns used) */
  public getGameStatus(gameId: number): PlayerGameStatus {
    const row = DB.prepare(selectPlayerStatusByGame).get(
      gameId,
      this.id
    ) as PlayerGameStatus

    if (!row) {
      throw new Error(
        `Could not get status for player id ${this.id} and game id ${gameId}`
      )
    }

    return row
  }

  // Get all stats: words, scores, etc.
  public getAllStats() {}
}
