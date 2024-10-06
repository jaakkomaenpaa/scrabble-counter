export const selectGameById = `
  SELECT id, startDate, endDate, mode, isFinished
  FROM games
  WHERE id = ?
`

export const insertNewGame = `
  INSERT INTO games (mode, startDate, endDate, isFinished)
  VALUES(?, ?, ?, ?)
`

export const updateGameFinish = `
  UPDATE games
  SET isFinished = 1, endDate = ?
  WHERE id = ?
`