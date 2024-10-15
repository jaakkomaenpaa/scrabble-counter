import { GameMode, GameParticipant, WordScoreApi } from '../types'
import { DB } from '../config'
import Player from './Player'
import { handleActionForPlayerOrTeam } from '../utils'
import Team from './Team'
import { insertNewGame, selectGameById, updateGameFinish } from '../queries/games'
import { insertPlayerWord } from '../queries/playerWords'
import { selectPlayerFromGame, updatePlayerGameStatus } from '../queries/playerGames'

export default class Game {
  constructor(
    public id: number,
    public mode: GameMode,
    public startDate: Date,
    public endDate: Date | null,
    public isFinished: boolean,
    public participants: GameParticipant[] = []
  ) {}

  /* Create game instance from database row */
  public static createFromRow(row: any): Game {
    const game = new Game(
      row.id,
      row.mode,
      new Date(row.startDate),
      row.endDate,
      row.isFinished
    )
    game.getParticipants()
    return game
  }

  /* Find a game by id */
  public static fetchById(id: number): Game {
    const row = DB.prepare(selectGameById).get(id) as Game

    if (!row) {
      throw new Error(`Game with id ${id} not found`)
    }

    return this.createFromRow(row)
  }

  /* Add a game template (start game) */
  public static addTemplate(
    mode: GameMode,
    date: Date,
    participants: GameParticipant[]
  ): Game {
    const insert = DB.prepare(insertNewGame).run(mode, date.toUTCString(), null, 0)

    if (insert.changes === 0) {
      throw new Error(`Could not create template for game`)
    }

    const gameId = insert.lastInsertRowid as number

    // Players and teams should exist at this point

    // Add players to game in db
    participants.forEach((entry: GameParticipant) => {
      handleActionForPlayerOrTeam(
        entry.participant,
        entry.isTeam,
        (player: Player, teamId?: number) => {
          player.addToGame(gameId, entry.inTurnIndex, teamId)
        }
      )
    })

    return this.fetchById(gameId)
  }

  /* Update game (play one turn) */
  public updateTurn(entry: GameParticipant, wordScore: WordScoreApi): void {
    const wordInsert = DB.prepare(insertPlayerWord)
    const statusUpdate = DB.prepare(updatePlayerGameStatus)

    const action = (player: Player, teamId?: number) => {
      try {
        wordInsert.run(
          player.id,
          this.id,
          teamId || null,
          wordScore.word,
          wordScore.score,
          wordScore.doubleLetterBonuses,
          wordScore.tripleLetterBonuses,
          wordScore.doubleWordBonuses,
          wordScore.tripleWordBonuses,
          wordScore.hasAllLettersBonus ? 1 : 0,
          wordScore.hasExtraPoints ? 1 : 0,
          wordScore.turnPlayedOn
        )
        statusUpdate.run(wordScore.score, player.id, this.id)
      } catch (error) {
        throw new Error(`Could not insert word score for player ${player.id}`)
      }
    }

    handleActionForPlayerOrTeam(entry.participant, entry.isTeam, action)
  }

  /* Get participants and their stats for a game */
  public getParticipants(): GameParticipant[] {
    const rows = DB.prepare(selectPlayerFromGame).all(this.id) as {
      playerId: number
      teamId: number | null
    }[]

    if (!rows) {
      throw new Error(`Could not find players for game id ${this.id}`)
    }

    const singlePlayers: Player[] = []
    const teams: Team[] = []

    rows.forEach((row) => {
      if (!row.teamId) {
        singlePlayers.push(Player.fetchById(row.playerId))
        return
      }

      const team = Team.fetchById(row.teamId)

      if (!teams.some((entry) => entry.id === team.id)) {
        team.getMembers()
        teams.push(team)
      }
    })

    this.participants = this.participants.concat(
      singlePlayers.map((player: Player) => {
        const status = player.getGameStatus(this.id)

        return {
          participant: player,
          isTeam: false,
          score: status.score,
          turnsUsed: status.turnsUsed,
          inTurnIndex: status.inTurnIndex,
          wordsPlayed: player.getWordsForGame(this.id),
        } as GameParticipant
      })
    )

    this.participants = this.participants.concat(
      teams.map((team: Team) => {
        const status = team.getGameStatus(this.id)

        return {
          participant: team,
          isTeam: true,
          score: status.score,
          turnsUsed: status.turnsUsed,
          inTurnIndex: status.inTurnIndex,
          wordsPlayed: team.getWordsForGame(this.id),
        } as GameParticipant
      })
    )

    return this.participants.sort(
      (a: GameParticipant, b: GameParticipant) => a.inTurnIndex - b.inTurnIndex
    )
  }

  /* Set game as finished */
  public finish(date: Date): void {
    const update = DB.prepare(updateGameFinish).run(date.toUTCString(), this.id)

    if (update.changes === 0) {
      throw new Error(`Could not finish game with id ${this.id}`)
    }
  }
}
