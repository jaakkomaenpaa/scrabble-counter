import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import styles from './HomePage.module.css'
import { Game } from '../../types'
import Card from '../../components/Card'
import gameService from '../../services/games'
import { formatDate } from '../../utils'
import Loader from '../../components/Loader'

const HomePage = () => {
  const [ongoingGames, setOngoingGames] = useState<Game[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const navigate = useNavigate()

  useEffect(() => {
    const getGameData = async () => {
      setIsLoading(true)

      const games = await gameService.getOngoing()
      if (games) {
        setOngoingGames(games)
      }

      setIsLoading(false)
    }
    getGameData()
  }, [])

  if (isLoading) {
    return <Loader />
  }

  return (
    <main className={styles.container}>
      <h2>Ongoing games</h2>
      <Card>
        {ongoingGames.length > 0 ? (
          <ul className={styles.gameList}>
            {ongoingGames.map((game: Game) => (
              <li
                key={game.id}
                className={styles.gameListItem}
                onClick={() => navigate(`game/${game.id}`)}
              >
                {game.mode} - {formatDate(game.startDate)}
              </li>
            ))}
          </ul>
        ) : (
          <p>No ongoing games</p>
        )}
      </Card>
    </main>
  )
}

export default HomePage
