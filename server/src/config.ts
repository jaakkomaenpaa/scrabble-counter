import Database from 'better-sqlite3'
import dotenv from 'dotenv'

dotenv.config()

const PORT = process.env.PORT || 3001
const MODE = process.env.MODE || 'development'

enum RunMode {
  Development = 'development',
  Test = 'test',
  Production = 'production',
}

const dbPaths: { [key in RunMode]: string } = {
  ['development']: '../database/scrabble-dev.db',
  ['test']: '../database/scrabble-test.db',
  ['production']: '../database/scrabble-prod.db',
}

const dbPath = dbPaths[MODE as RunMode]

export const DB = new Database(dbPath, {
  fileMustExist: true,
})

export const config = {
  PORT,
  MODE,
}
