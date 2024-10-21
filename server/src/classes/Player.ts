import { DB } from '../config'
import {
  insertPlayer,
  selectAllPlayers,
  selectPlayerByDispName,
  selectPlayerById,
} from '../queries/players'
import {
  insertPlayerToGame,
  selectPlayerStatusByGame,
  selectTotalPlayerGameStats,
} from '../queries/playerGames'
import {
  selectPlayerWordsByGame,
  selectTotalPlayerWords,
} from '../queries/playerWords'
import {
  PlayerGameStatus,
  PlayerWithTotalGameStats,
  TotalGameStats,
  WordScoreApi,
} from '../types'

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

    if (Object.values(player).some((value) => value === undefined)) {
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

    return rows.map((row) => this.createFromRow(row))
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
  public addToGame(gameId: number, inTurnIndex: number, teamId?: number): void {
    const insert = DB.prepare(insertPlayerToGame).run(
      this.id,
      gameId,
      0,
      0,
      inTurnIndex,
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
  public getTotalGameStats(): PlayerWithTotalGameStats {
    const gameRow = DB.prepare(selectTotalPlayerGameStats).get(this.id) as {
      totalScore: number
      totalGames: number
      totalTurnsUsed: number
    }
    const wordRow = DB.prepare(selectTotalPlayerWords).get(this.id) as {
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
      } as PlayerWithTotalGameStats
    }

    const stats = {
      ...this,
      ...gameRow,
      ...wordRow,
      avgGameScore: gameRow.totalScore / gameRow.totalGames || 0,
      avgWordScore: gameRow.totalScore / wordRow.totalWords || 0,
      avgWordsPlayed: wordRow.totalWords / gameRow.totalGames || 0,
    } as PlayerWithTotalGameStats

    return stats
  }
}
