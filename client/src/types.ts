export interface Player {
  id: number
  displayName: string
  fullName: string
  wordList?: number
}

export interface Game {
  id: number
  mode: GameMode
  startDate: Date
  endDate: Date
  isFinished: boolean
  participants: GameParticipant[]
}

export enum Letter {
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D',
  E = 'E',
  F = 'F',
  G = 'G',
  H = 'H',
  I = 'I',
  J = 'J',
  K = 'K',
  L = 'L',
  M = 'M',
  N = 'N',
  O = 'O',
  P = 'P',
  Q = 'Q',
  R = 'R',
  S = 'S',
  T = 'T',
  U = 'U',
  V = 'V',
  W = 'W',
  X = 'X',
  Y = 'Y',
  Z = 'Z',
  Å = 'Å',
  Ä = 'Ä',
  Ö = 'Ö',
  Joker = 'Joker',
  NoLetter = '',
}

export interface LetterScore {
  letter: Letter
  bonus: Bonus
}

export interface TemporaryTeam {
  name: string
  members: Player[]
}

export interface Team extends TemporaryTeam {
  id: number
}

export enum Bonus {
  LetterDouble = '2X Letter',
  LetterTriple = '3X Letter',
  WordDouble = '2X Word',
  WordTriple = '3X Word',
  Joker = 'Joker',
  NoBonus = 'No bonus',
}

export interface GameParticipant {
  participant: Player | Team
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

export interface ModalPosition {
  top: number | string
  left: number | string
}

export enum LocalStorageKey {
  AllPlayersList = 'allplayerslist',
  SinglePlayerList = 'singleplayerlist',
  TeamList = 'teamlist'
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