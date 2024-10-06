import { Bonus, Letter, LetterScore, WordScoreApi } from '../types'

interface LetterInfo {
  value: number | null
  amount: number
}

const ALL_LETTERS_USED_BONUS = 50
const MAX_ALLOWED_SCORE = 999

export const getWordScoreObject = (
  letters: LetterScore[],
  getsBonus: boolean,
  extraPoints: number,
  turnPlayedOn: number
): WordScoreApi => {
  let multiplier = 1
  let score = 0
  let doubleLetterBonuses = 0
  let tripleLetterBonuses = 0
  let doubleWordBonuses = 0
  let tripleWordBonuses = 0
  let word = ''

  letters.forEach((letter: LetterScore) => {
    let value = LETTER_VALUES[letter.letter].value || 0

    if (letter.bonus === Bonus.LetterDouble) {
      value *= 2
      doubleLetterBonuses++
    } else if (letter.bonus === Bonus.LetterTriple) {
      value *= 3
      tripleLetterBonuses++
    } else if (letter.bonus === Bonus.WordDouble) {
      multiplier *= 2
      doubleWordBonuses++
    } else if (letter.bonus === Bonus.WordTriple) {
      multiplier *= 3
      tripleWordBonuses++
    } else if (letter.bonus === Bonus.Joker) {
      value = 0
    }

    score += value
    word += letter.letter
  })

  score *= multiplier
  score += extraPoints

  if (getsBonus) {
    score += ALL_LETTERS_USED_BONUS
  }

  if (score > MAX_ALLOWED_SCORE) {
    score = MAX_ALLOWED_SCORE
  }

  return {
    word,
    score,
    doubleLetterBonuses,
    tripleLetterBonuses,
    doubleWordBonuses,
    tripleWordBonuses,
    hasAllLettersBonus: getsBonus,
    hasExtraPoints: extraPoints > 0,
    turnPlayedOn,
  } as WordScoreApi
}

export const LETTER_VALUES: {
  [key in Letter]: LetterInfo
} = {
  [Letter.A]: {
    value: 1,
    amount: 10,
  },
  [Letter.B]: {
    value: 8,
    amount: 1,
  },
  [Letter.C]: {
    value: 10,
    amount: 1,
  },
  [Letter.D]: {
    value: 7,
    amount: 1,
  },
  [Letter.E]: {
    value: 1,
    amount: 8,
  },
  [Letter.F]: {
    value: 8,
    amount: 1,
  },
  [Letter.G]: {
    value: 8,
    amount: 1,
  },
  [Letter.H]: {
    value: 4,
    amount: 2,
  },
  [Letter.I]: {
    value: 1,
    amount: 10,
  },
  [Letter.J]: {
    value: 4,
    amount: 2,
  },
  [Letter.K]: {
    value: 2,
    amount: 5,
  },
  [Letter.L]: {
    value: 2,
    amount: 5,
  },
  [Letter.M]: {
    value: 3,
    amount: 3,
  },
  [Letter.N]: {
    value: 1,
    amount: 9,
  },
  [Letter.O]: {
    value: 2,
    amount: 5,
  },
  [Letter.P]: {
    value: 4,
    amount: 2,
  },
  [Letter.Q]: {
    value: null,
    amount: 0,
  },
  [Letter.R]: {
    value: 4,
    amount: 2,
  },
  [Letter.S]: {
    value: 1,
    amount: 7,
  },
  [Letter.T]: {
    value: 1,
    amount: 9,
  },
  [Letter.U]: {
    value: 4,
    amount: 2,
  },
  [Letter.V]: {
    value: 4,
    amount: 2,
  },
  [Letter.W]: {
    value: null,
    amount: 0,
  },
  [Letter.X]: {
    value: null,
    amount: 0,
  },
  [Letter.Y]: {
    value: 4,
    amount: 2,
  },
  [Letter.Z]: {
    value: null,
    amount: 0,
  },
  [Letter.Å]: {
    value: null,
    amount: 0,
  },
  [Letter.Ä]: {
    value: 2,
    amount: 5,
  },
  [Letter.Ö]: {
    value: 7,
    amount: 1,
  },
  [Letter.Joker]: {
    value: 0,
    amount: 2,
  },
  [Letter.NoLetter]: {
    value: null,
    amount: 0,
  },
}
