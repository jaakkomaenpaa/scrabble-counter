import { IoRemoveCircleOutline } from 'react-icons/io5'

import { Player, Team } from '../../types'
import styles from './GameSetup.module.css'
import TeamSelect from './TeamSelect'
import { getTeamDisplayName } from '../../utils'

interface PlayerListSectionProps {
  playersForGame: Player[]
  teamList: Team[]
  singlePlayerList: Player[]
  removePlayer: (player: Player) => void
  removeTeam: (team: Team) => void
  handleAddTeam: (team: Team) => void
}

const PlayerListSection = ({
  playersForGame,
  teamList,
  singlePlayerList,
  removePlayer,
  removeTeam,
  handleAddTeam,
}: PlayerListSectionProps) => {
  return (
    <section className={styles.playerListSection}>
      <h2 className={styles.playerListHeader}>Participants</h2>
      <div className={styles.playerListCard}>
        {playersForGame.length > 0 ? (
          <div className={styles.playerListContainer}>
            <h3>Players</h3>
            <ul className={styles.playerList}>
              {singlePlayerList.map((player: Player) => (
                <li key={player.id} className={styles.playerListItem}>
                  {player.displayName}{' '}
                  <IoRemoveCircleOutline
                    size={20}
                    className={styles.removeIcon}
                    onClick={() => removePlayer(player)}
                  />
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p>No players yet</p>
        )}
        {teamList.length > 0 && (
          <div className={styles.teamListContainer}>
            <h3>Teams</h3>
            <ul className={styles.teamList}>
              {teamList.map((team: Team) => (
                <li key={team.id} className={styles.teamListItem}>
                  {getTeamDisplayName(team)}{' '}
                  <IoRemoveCircleOutline
                    size={20}
                    className={styles.removeIcon}
                    onClick={() => removeTeam(team)}
                  />
                </li>
              ))}
            </ul>
          </div>
        )}
        {playersForGame.length >= 0 && (
          <TeamSelect singlePlayerList={singlePlayerList} addTeam={handleAddTeam} />
        )}
      </div>
    </section>
  )
}

export default PlayerListSection
