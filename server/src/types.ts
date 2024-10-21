import Player from './classes/Player'
import Team from './classes/Team'

export interface TeamWithMembers {
  id: number
  name: string
  members: Player[]
}

export interface PlayerGameStatus {
  score: number
  turnsUsed: number
  inTurnIndex: number
}

export interface GameParticipant {
  participant: Player | TeamWithMembers
  isTeam: boolean
  score: number
  turnsUsed: number
  inTurnIndex: number
  wordsPlayed: WordScoreApi[]
}

export interface WordScoreApi {
  word: string
  score: number
  doubleLetterBonuses: number
  tripleLetterBonuses: number
  doubleWordBonuses: number
  tripleWordBonuses: number
  hasAllLettersBonus: boolean
  hasExtraPoints: boolean
  turnPlayedOn: number
}

export enum GameMode {
  Normal = 'Normal',
  Ghetto = 'Ghetto',
}

export interface TotalGameStats {
  totalScore: number
  totalGames: number
  totalTurnsUsed: number
  totalWords: number
  avgGameScore: number
  avgWordScore: number
  avgWordsPlayed: number
}

export type PlayerWithTotalGameStats = Player & TotalGameStats

export type TeamWithTotalGameStats = Team & TotalGameStats