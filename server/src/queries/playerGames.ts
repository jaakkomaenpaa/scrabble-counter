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
    AND teamId IS NOT NULL
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

export const selectTotalPlayerGameStats = `
  SELECT 
    COALESCE(SUM(score), 0) AS totalScore, 
    COALESCE(SUM(turnsUsed), 0) AS totalTurnsUsed, 
    COUNT(playerId) AS totalGames
  FROM playerGames
  WHERE playerId = ?
`

export const selectTotalTeamGameStats = `
  SELECT 
    COALESCE(SUM(score) / 2, 0) AS totalScore, 
    COALESCE(SUM(turnsUsed) / 2, 0) AS totalTurnsUsed, 
    COUNT(playerId) / 2 AS totalGames
  FROM playerGames
  WHERE teamId = ?
`

export const selectPlayerTeamIds = `
  SELECT DISTINCT teamId
  FROM playerGames
  WHERE playerId = ?
   AND teamId IS NOT NULL
`