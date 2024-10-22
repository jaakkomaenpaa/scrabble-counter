import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'

import styles from './TeamStats.module.css'
import { Player, TeamWithAllStats, WordScoreApi } from '../../types'
import teamService from '../../services/teams'
import Loader from '../../components/Loader'

const TeamStats = () => {
  const [team, setTeam] = useState<TeamWithAllStats>()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const { teamId } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    const getTeam = async () => {
      setIsLoading(true)
      if (!teamId) return

      const teamData = await teamService.getOneWithAllStats(teamId)
      setTeam(teamData)
      setIsLoading(false)
    }
    getTeam()
  }, [teamId])

  if (isLoading) {
    return <Loader />
  }

  if (!team && !isLoading) {
    navigate('/error')
    return null
  }

  return (
    <main className={styles.container}>
      <div className={styles.header}>
        <h2>Stats</h2>
        <p> for {team?.name}</p>
        <h4>Members</h4>
        <div className={styles.memberContainer}>
          {team?.members.map((player: Player) => (
            <p key={player.id} onClick={() => navigate(`/stats/player/${player.id}`)}>
              {player.displayName}
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
              <td className={styles.tdTotal}>{team?.name}</td>
              <td className={styles.tdTotal}>{team?.totalScore}</td>
              <td className={styles.tdTotal}>{team?.totalGames}</td>
              <td className={styles.tdTotal}>{team?.totalWords}</td>
            </tr>
          </tbody>
        </table>
      </div>
      {team?.allWords && team.allWords.length > 0 && (
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
              </tr>
            </thead>
            <tbody>
              {team?.allWords.map((word: WordScoreApi, index: number) => (
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  )
}

export default TeamStats
