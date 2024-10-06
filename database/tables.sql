CREATE TABLE
  players (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fullName TEXT NOT NULL,
    displayName TEXT NOT NULL UNIQUE
  );

CREATE TABLE
  games (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    startDate TEXT NOT NULL,
    endDate TEXT, -- NULL if not finished
    mode TEXT CHECK (mode IN ('Normal', 'Ghetto')),
    isFinished BOOLEAN
  );

CREATE TABLE
  playerGames (
    playerId INTEGER,
    gameId INTEGER,
    score INTEGER,
    turnsUsed INTEGER,
    teamId INTEGER, --NULL if no team
    PRIMARY KEY (playerId, gameId),
    FOREIGN KEY (playerId) REFERENCES players (id) ON DELETE CASCADE,
    FOREIGN KEY (gameId) REFERENCES games (id) ON DELETE CASCADE
  );

CREATE TABLE
  teams (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
  );

CREATE TABLE
  playerWords (
    playerId INTEGER,
    gameId INTEGER,
    word TEXT,
    score INTEGER NOT NULL,
    doubleLetterBonuses INTEGER,
    tripleLetterBonuses INTEGER,
    doubleWordBonuses INTEGER,
    tripleWordBonuses INTEGER,
    hasAllLettersBonus BOOLEAN,
    hasExtraPoints BOOLEAN,
    turnPlayedOn INTEGER,
    teamId INTEGER, --NULL if no team
    PRIMARY KEY (playerId, gameId, turnPlayedOn),
    FOREIGN KEY (playerId) REFERENCES players (id) ON DELETE CASCADE,
    FOREIGN KEY (gameId) REFERENCES games (id) ON DELETE CASCADE
  );
