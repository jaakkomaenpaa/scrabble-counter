import Database from 'better-sqlite3'
import { Request, Response } from 'express'
import { faker } from '@faker-js/faker'

import {
  createGames,
  createPlayerGames,
  createPlayers,
  createPlayerWords,
  createTeams,
} from '../queries/creates'
import { clearDbTables, dropDbTables } from '../queries/deletes'
import Player from '../classes/Player'

// TODO: make these require authentication

const DB_PATH = '../database'

export const initDatabase = (req: Request, res: Response) => {
  const dbName = req.params.dbName
  if (!dbName) {
    return res.status(400).send(`Falsy db name ${dbName}`)
  }

  const db = new Database(`${DB_PATH}/${dbName}.db`, {
    fileMustExist: true,
  })

  if (!db) {
    return res.status(400).send(`DB with name ${dbName} not found.`)
  }

  try {
    db.exec(createPlayers)
    db.exec(createGames)
    db.exec(createPlayerGames)
    db.exec(createTeams)
    db.exec(createPlayerWords)

    res.status(200).send('Database and tables created successfully!')
  } catch (error) {
    res.status(500).send(`Error creating tables: ${error}`)
  }
}

export const createDatabase = (req: Request, res: Response) => {
  const dbName = req.params.dbName

  if (!dbName) {
    return res.status(400).send(`Falsy db name ${dbName}`)
  }

  try {
    new Database(`${DB_PATH}/${dbName}.db`)
    initDatabase(req, res)
  } catch (error) {
    res.status(500).send(`Error creating database: ${error}`)
  }
}

export const clearDatabase = (req: Request, res: Response) => {
  const dbName = req.params.dbName
  if (!dbName) {
    return res.status(400).send(`Falsy db name ${dbName}`)
  }

  const db = new Database(`${DB_PATH}/${dbName}.db`, {
    fileMustExist: true,
  })

  if (!db) {
    return res.status(400).send(`DB with name ${dbName} not found.`)
  }

  try {
    db.exec(clearDbTables)

    res.status(200).send('Tables cleared successfully!')
  } catch (error) {
    res.status(500).send(`Error clearing tables: ${error}`)
  }
}

export const deleteDatabase = (req: Request, res: Response) => {
  const dbName = req.params.dbName
  if (!dbName) {
    return res.status(400).send(`Falsy db name ${dbName}`)
  }

  const db = new Database(`${DB_PATH}/${dbName}.db`, {
    fileMustExist: true,
  })

  if (!db) {
    return res.status(400).send(`DB with name ${dbName} not found.`)
  }

  try {
    db.exec(dropDbTables)

    res.status(200).send('Tables cleared successfully!')
  } catch (error) {
    res.status(500).send(`Error clearing tables: ${error}`)
  }
}

export const updateDatabase = (req: Request, res: Response) => {
  const dbName = req.params.dbName
  if (!dbName) {
    return res.status(400).send(`Falsy db name ${dbName}`)
  }

  const db = new Database(`${DB_PATH}/${dbName}.db`, {
    fileMustExist: true,
  })

  if (!db) {
    return res.status(400).send(`DB with name ${dbName} not found.`)
  }

  try {
    db.exec(dropDbTables)
    initDatabase(req, res)

    res.status(200).send('Tables cleared and updated successfully!')
  } catch (error) {
    res.status(500).send(`Error clearing tables: ${error}`)
  }
}

export const addFakePlayers = (req: Request, res: Response) => {
  const amount: number = parseInt(req.params.amount)

  try {
    for (let i = 0; i < amount; i++) {
      Player.create(faker.person.fullName(), faker.internet.displayName())
    }
    res.status(200).send('Player created successfully.')
  } catch (error) {
    console.error(error)
    res.status(500).send(`Error adding player: ${error}`)
  }
}
