export const selectTeamById = `
  SELECT id, name
  FROM teams
  WHERE id = ?  
`

export const selectAllTeams = `
  SELECT id, name
  FROM teams
`

export const insertTeam = `
  INSERT INTO teams (name)
  VALUES (?)
`

export const updateTeamName = `
  UPDATE teams
  SET name = ?
  WHERE id = ?
`

export const deleteTeam = `
  DELETE FROM teams
  WHERE id = ?
`
