import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import styles from './PlayerStats.module.css'
import { PlayerWithAllStats, Team, WordScoreApi } from '../../types'
import playerService from '../../services/players'
import Loader from '../../components/Loader'

const PlayerStats = () => {
  const [player, setPlayer] = useState<PlayerWithAllStats>()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const { playerId } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    const getPlayer = async () => {
      setIsLoading(true)
      if (!playerId) return

      const playerData = await playerService.getOneWithAllStats(playerId)
      setPlayer(playerData)
      setIsLoading(false)
    }
    getPlayer()
  }, [playerId])

  const handleNavigate = (team: Team | undefined) => {
    if (!team) return
    navigate(`/stats/team/${team.id}`)
  }

  if (isLoading) {
    return <Loader />
  }

  if (!player && !isLoading) {
    navigate('/error')
    return null
  }

  return (
    <main className={styles.container}>
      <div className={styles.header}>
        <h2>Stats</h2>
        <p> for {player?.fullName}</p>
        <h4>Teams</h4>
        <div className={styles.teamContainer}>
          {player?.teams.map((team: Team) => (
            <p key={team.id} onClick={() => navigate(`/stats/team/${team.id}`)}>
              {team.name}
            </p>
          ))}
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <h4>Totals</h4>
        <table className={styles.table}>
          <thead>
            <tr className={styles.tr}>
              <th className={styles.thTotal}>Username</th>
              <th className={styles.thTotal}>Total score</th>
              <th className={styles.thTotal}>Total games</th>
              <th className={styles.thTotal}>Total words</th>
            </tr>
          </thead>
          <tbody>
            <tr className={styles.tr}>
              <td className={styles.tdTotal}>{player?.displayName}</td>
              <td className={styles.tdTotal}>{player?.totalScore}</td>
              <td className={styles.tdTotal}>{player?.totalGames}</td>
              <td className={styles.tdTotal}>{player?.totalWords}</td>
            </tr>
          </tbody>
        </table>
      </div>
      {player?.allWords && player.allWords.length > 0 && (
        <div className={styles.tableWrapper}>
          <h4>Top words</h4>
          <table className={styles.table}>
            <thead>
              <tr className={styles.tr}>
                <th className={styles.thWord}>Word</th>
                <th className={styles.thWord}>Score</th>
                <th className={styles.thWord}>50p bonus?</th>
                <th className={styles.thWord}>Extra points?</th>
                <th className={styles.thWord}>3X Word</th>
                <th className={styles.thWord}>2X Word</th>
                <th className={styles.thWord}>3X Letter</th>
                <th className={styles.thWord}>2X Letter</th>
                <th className={styles.thWord}>Mode</th>
                <th className={styles.thWord}>Team</th>
              </tr>
            </thead>
            <tbody>
              {player?.allWords.map((word: WordScoreApi, index: number) => (
                <tr key={index} className={styles.tr}>
                  <td className={styles.tdWord}>{word.word}</td>
                  <td className={styles.tdWord}>{word.score}</td>
                  <td className={styles.tdWord}>
                    {word.hasAllLettersBonus ? 'X' : '-'}
                  </td>
                  <td className={styles.tdWord}>{word.hasExtraPoints ? 'X' : '-'}</td>
                  <td className={styles.tdWord}>{word.tripleWordBonuses}</td>
                  <td className={styles.tdWord}>{word.doubleWordBonuses}</td>
                  <td className={styles.tdWord}>{word.tripleLetterBonuses}</td>
                  <td className={styles.tdWord}>{word.doubleLetterBonuses}</td>
                  <td className={styles.tdWord}>{word.mode}</td>
                  <td
                    onClick={() => handleNavigate(word.team)}
                    className={styles.tdWord}
                  >
                    {word.team?.name}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  )
}

export default PlayerStats
