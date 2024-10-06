import { GameParticipant, Player, Team } from '../../types'
import { getTeamDisplayName } from '../../utils'
import styles from './Game.module.css'

interface FinishedGameProps {
  participants: GameParticipant[]
}

const FinishedGame = ({participants}: FinishedGameProps) => {

  const sortedEntries = participants.sort((a, b) => {
    return b.score - a.score
  })

  return (
    <section className={styles.finishedGameContainer}>
      <p>This game is finished</p>
      <p>Results: </p>
      <table className={styles.playerTable}>
        <thead>
          <tr className={styles.tr}>
            <th className={styles.th}>Player / Team</th>
            <th className={styles.th}>Score</th>
          </tr>
        </thead>
        <tbody>
          {sortedEntries.map((entry: GameParticipant, index: number) => {
            let participant
            let displayName
            if (entry.isTeam) {
              participant = entry.participant as Team
              displayName = getTeamDisplayName(participant)
            } else {
              participant = entry.participant as Player
              displayName = participant.displayName
            }

            return (
              <tr key={index} className={styles.tr}>
                <td className={styles.td}>{displayName}</td>
                <td className={styles.td}>{entry.score}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </section>
  )
}

export default FinishedGame
