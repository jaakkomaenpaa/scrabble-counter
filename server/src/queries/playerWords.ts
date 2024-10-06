const baseWordSelectionQuery = `
  SELECT DISTINCT word, score, doubleLetterBonuses, tripleLetterBonuses,
  doubleWordBonuses, tripleWordBonuses, hasAllLettersBonus, hasExtraPoints, 
  turnPlayedOn
  FROM playerWords
  WHERE gameId = ? 
`

export const selectPlayerWordsByGame = `
  ${baseWordSelectionQuery}
  AND playerId = ? 
`

export const selectTeamWordsByGame = `
  ${baseWordSelectionQuery}
  AND teamId = ?
`

export const insertPlayerWord = `
  INSERT INTO playerWords (
    playerId, gameId, teamId, word, score, doubleLetterBonuses, 
    tripleLetterBonuses, doubleWordBonuses, tripleWordBonuses, hasAllLettersBonus, 
    hasExtraPoints, turnPlayedOn
  )
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`
