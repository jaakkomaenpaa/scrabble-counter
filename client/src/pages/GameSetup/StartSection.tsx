import { GameMode } from '../../types'
import styles from './GameSetup.module.css'
import { SubmitButton } from '../../components/Buttons'
import { theme } from '../../theme'

interface StartSectionProps {
  gameMode: GameMode
  setGameMode: (mode: GameMode) => void
  onStart: () => void
}

const StartSection = ({ gameMode, setGameMode, onStart }: StartSectionProps) => {
  return (
    <section className={styles.startContainer}>
      <div className={styles.gameModeSelectContainer}>
        <label htmlFor='gameModeSelect'>Game mode:</label>
        <select
          id='gameModeSelect'
          className={styles.gameModeSelect}
          value={gameMode}
          onChange={(e) => setGameMode(e.target.value as GameMode)}
        >
          {Object.values(GameMode).map((mode: GameMode) => (
            <option className={styles.gameModeOption} key={mode} value={mode}>
              {mode}
            </option>
          ))}
        </select>
      </div>
      <div className={styles.startButtonContainer}>
        <SubmitButton
          onClick={onStart}
          label='Start game'
          customStyles={{ fontWeight: theme.fontWeights.bold }}
        />
      </div>
    </section>
  )
}

export default StartSection
