const baseStatusSelectionQuery = `
  SELECT score, turnsUsed, inTurnIndex
  FROM playerGames
  WHERE gameId = ?
`

export const selectPlayerStatusByGame = `
  ${baseStatusSelectionQuery}
  AND playerId = ?
`

export const selectTeamStatusByGame = `
  ${baseStatusSelectionQuery}
  AND teamId = ?
`

export const selectPlayerFromGame = `
  SELECT playerId, teamId
  FROM playerGames AS pg
  INNER JOIN players AS p ON p.id = pg.playerId
  WHERE gameId = ?
`

export const selectTeamMembers = `
  SELECT DISTINCT playerId
  FROM playerGames
  WHERE teamId = ?
`

export const selectTeamByMembers = (placeholders: string) => `
  SELECT DISTINCT teamId
  FROM playerGames
  WHERE playerId IN (${placeholders})
  GROUP BY gameId, teamId
  HAVING COUNT(DISTINCT playerId) = ?
`

export const insertPlayerToGame = `
  INSERT INTO playerGames (playerId, gameId, score, turnsUsed, inTurnIndex, teamId)
  VALUES (?, ?, ?, ?, ?, ?)
`

export const updatePlayerGameStatus = `
  UPDATE playerGames
  SET score = score + ?, turnsUsed = turnsUsed + 1
  WHERE playerId = ? 
    AND gameId = ?
`
