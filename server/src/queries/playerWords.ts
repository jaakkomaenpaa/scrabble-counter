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

export const selectTotalPlayerWords = `
  SELECT COUNT(word) AS totalWords
  FROM playerWords
  WHERE playerId = ?
    AND word != '' AND word IS NOT NULL
`

export const selectTotalTeamWords = `
  SELECT COUNT(word) / 2 AS totalWords
  FROM playerWords
  WHERE teamId = ?
    AND word != '' AND word IS NOT NULL
`

export const selectAllPlayerWords = `
  SELECT DISTINCT word, score, doubleLetterBonuses, tripleLetterBonuses,
    doubleWordBonuses, tripleWordBonuses, hasAllLettersBonus, hasExtraPoints, 
    turnPlayedOn, teamId, mode
  FROM playerWords pw
  INNER JOIN games g ON pw.gameId = g.id
  WHERE playerId = ?
    AND word != '' AND word IS NOT NULL
  ORDER BY score DESC
`

export const selectAllTeamWords = `
  SELECT DISTINCT word, score, doubleLetterBonuses, tripleLetterBonuses,
    doubleWordBonuses, tripleWordBonuses, hasAllLettersBonus, hasExtraPoints, 
    turnPlayedOn, mode
  FROM playerWords pw
  INNER JOIN games g ON pw.gameId = g.id
  WHERE teamId = ?
    AND word != '' AND word IS NOT NULL
  ORDER BY score DESC
`
