import Database from 'better-sqlite3'
import dotenv from 'dotenv'

dotenv.config()

const PORT = process.env.PORT || 3001

const MODE = process.env.MODE || 'development'

const dbPath =
  MODE === 'development'
    ? `../database/scrabble-test.db`
    : `../database/scrabble-prod.db`

export const DB = new Database(dbPath, {
  fileMustExist: true,
})

export const config = {
  PORT,
  MODE,
}
