import express, { Request, Response } from 'express'
import cors from 'cors'
import playerRouter from './routes/player.route'
import gameRouter from './routes/game.route'
import teamRouter from './routes/team.route'

const app = express()

app.use(express.json())
app.use(cors())

app.use('/api/players', playerRouter)
app.use('/api/games', gameRouter)
app.use('/api/teams', teamRouter)

app.get('/api/status', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Server is running!' })
})

export default app
