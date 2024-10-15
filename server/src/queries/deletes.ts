export const dropDbTables = `
  DROP TABLE players;
  DROP TABLE games;
  DROP TABLE playerGames;
  DROP TABLE teams;
  DROP TABLE playerWords;
`

export const clearDbTables = `
  DELETE FROM players;
  DELETE FROM games;
  DELETE FROM playerGames;
  DELETE FROM teams;
  DELETE FROM playerWords;
`
