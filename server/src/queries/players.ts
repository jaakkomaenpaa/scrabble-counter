export const insertPlayer = `
  INSERT INTO players (fullName, displayName)
  VALUES (?, ?)
`

export const selectAllPlayers = `
  SELECT id, fullName, displayName 
  FROM players
`

export const selectPlayerById = `
  ${selectAllPlayers}
  WHERE id = ?
`

export const selectPlayerByDispName = `
  ${selectAllPlayers}
  WHERE displayName = ?
`
