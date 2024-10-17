import PlayerForm from './PlayerForm'
import PlayerSearch from './PlayerSearch'
import styles from './GameSetup.module.css'
import { Player } from '../../types'
import Card from '../../components/Card'

interface PlayerAddSectionProps {
  playerListFromApi: Player[]
  playersForGame: Player[]
  handleAddPlayer: (player: Player) => void
}

const PlayerAddSection = ({
  playerListFromApi,
  playersForGame,
  handleAddPlayer,
}: PlayerAddSectionProps) => {
  return (
    <section className={styles.playerAddSection}>
      <h2>Add players</h2>
      <Card>
        <PlayerSearch
          playerListFromApi={playerListFromApi}
          playersForGame={playersForGame}
          addPlayer={handleAddPlayer}
        />
        <PlayerForm addPlayer={handleAddPlayer} />
      </Card>
    </section>
  )
}

export default PlayerAddSection
