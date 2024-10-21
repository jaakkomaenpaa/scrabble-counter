import { useEffect, useState } from 'react'
import styles from './Ranking.module.css'
import { PlayerWithTotalGameStats, TeamWithTotalGameStats } from '../../types'
import playerService from '../../services/players'
import teamService from '../../services/teams'
import Loader from '../../components/Loader'
import { getPlayerOrTeamDisplayName } from '../../utils'
import { useNavigate } from 'react-router-dom'

enum RankingType {
  Players = 'Players',
  Teams = 'Teams',
  All = 'All',
}

enum SortBy {
  TotalScore = 'Total score',
  AvgGameScore = 'Avg game score',
  TotalWords = 'Total words',
  AvgWords = 'Avg words',
  TotalGames = 'Total games',
  AvgWordScore = 'Avg word score',
}

const getSortFactor = (
  a: PlayerWithTotalGameStats | TeamWithTotalGameStats,
  b: PlayerWithTotalGameStats | TeamWithTotalGameStats,
  sortBy: SortBy,
  isAscending: boolean
): number => {
  const sortObject: { [key in SortBy]: number } = {
    [SortBy.TotalScore]: a.totalScore - b.totalScore,
    [SortBy.AvgGameScore]: a.avgGameScore - b.avgGameScore,
    [SortBy.TotalWords]: a.totalWords - b.totalWords,
    [SortBy.AvgWords]: a.avgWordsPlayed - b.avgWordsPlayed,
    [SortBy.TotalGames]: a.totalGames - b.totalGames,
    [SortBy.AvgWordScore]: a.avgWordScore - b.avgWordScore,
  }

  let factor = sortObject[sortBy]

  // Reverse order
  if (!isAscending) {
    factor *= -1
  }

  return factor
}

const Ranking = () => {
  const [allEntries, setAllEntries] = useState<
    (PlayerWithTotalGameStats | TeamWithTotalGameStats)[]
  >([])
  const [entriesToShow, setEntriesToShow] = useState<
    (PlayerWithTotalGameStats | TeamWithTotalGameStats)[]
  >([])
  const [players, setPlayers] = useState<PlayerWithTotalGameStats[]>([])
  const [teams, setTeams] = useState<TeamWithTotalGameStats[]>([])
  const [sortBy, setSortBy] = useState<SortBy>(SortBy.TotalScore)
  const [isAscending, setIsAscending] = useState<boolean>(false)
  const [rankingType, setRankingType] = useState<RankingType>(RankingType.Players)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const navigate = useNavigate()

  useEffect(() => {
    const getEntries = async () => {
      setIsLoading(true)
      const playersWitStats = await playerService.getAllWithTotalGameStats()
      if (playersWitStats) {
        setPlayers(playersWitStats)
      }

      const teamsWithStats = await teamService.getAllWithTotalGameStats()
      if (teamsWithStats) {
        setTeams(teamsWithStats)
      }

      if (playersWitStats && teamsWithStats) {
        setAllEntries([...playersWitStats, ...teamsWithStats])
      }

      setEntriesToShow(playersWitStats)

      setIsLoading(false)
    }
    getEntries()
  }, [])

  useEffect(() => {
    if (rankingType === RankingType.Players) {
      setEntriesToShow(players)
    } else if (rankingType === RankingType.Teams) {
      setEntriesToShow(teams)
    } else {
      setEntriesToShow(allEntries)
    }
  }, [rankingType, players, teams, allEntries])

  if (isLoading) {
    return <Loader />
  }

  const handleEntryClick = (
    entry: PlayerWithTotalGameStats | TeamWithTotalGameStats
  ) => {
    if ('members' in entry) {
      navigate(`/stats/team/${entry.id}`)
    } else {
      navigate(`/stats/player/${entry.id}`)
    }
  }

  return (
    <section className={styles.container}>
      <h2>Ranking</h2>
      <section className={styles.filterContainer}>
        <select
          name='sort-by'
          className={styles.sortBySelect}
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortBy)}
        >
          {Object.values(SortBy).map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
        <select
          name='ranking-type'
          className={styles.sortBySelect}
          value={rankingType}
          onChange={(e) => setRankingType(e.target.value as RankingType)}
        >
          {Object.values(RankingType).map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
        <input
          className={styles.toggleAscending}
          type='checkbox'
          checked={isAscending}
          onChange={() => setIsAscending(!isAscending)}
        />
      </section>
      <div className={styles.tableWrapper}>
        <table className={styles.playerTable}>
          <thead>
            <tr className={styles.tr}>
              <th className={styles.th}>Rank</th>
              <th className={styles.th}>Username</th>
              <th className={styles.th}>Total score</th>
              <th className={styles.th}>Total games</th>
              <th className={styles.th}>Total turns</th>
              <th className={styles.th}>Total words</th>
              <th className={styles.th}>Avg game score</th>
              <th className={styles.th}>Avg word score</th>
              <th className={styles.th}>Avg words</th>
            </tr>
          </thead>
          <tbody>
            {entriesToShow
              .sort(
                (
                  a: PlayerWithTotalGameStats | TeamWithTotalGameStats,
                  b: PlayerWithTotalGameStats | TeamWithTotalGameStats
                ) => {
                  return getSortFactor(a, b, sortBy, isAscending)
                }
              )
              .map(
                (
                  entry: PlayerWithTotalGameStats | TeamWithTotalGameStats,
                  index: number
                ) => {
                  const rank = index + 1
                  return (
                    <tr key={entry.id} className={styles.tr}>
                      <td className={styles.td}>{rank}</td>
                      <td
                        className={styles.td}
                        onClick={() => handleEntryClick(entry)}
                      >
                        {getPlayerOrTeamDisplayName(entry)}
                      </td>
                      <td className={styles.td}>{entry.totalScore}</td>
                      <td className={styles.td}>{entry.totalGames}</td>
                      <td className={styles.td}>{entry.totalTurnsUsed}</td>
                      <td className={styles.td}>{entry.totalWords}</td>
                      <td className={styles.td}>{entry.avgGameScore.toFixed(1)}</td>
                      <td className={styles.td}>{entry.avgWordScore.toFixed(1)}</td>
                      <td className={styles.td}>{entry.avgWordsPlayed.toFixed(1)}</td>
                    </tr>
                  )
                }
              )}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default Ranking
