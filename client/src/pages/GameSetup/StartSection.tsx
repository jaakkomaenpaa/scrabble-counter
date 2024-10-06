import { useState } from 'react'
import { GameMode } from '../../types'
import styles from './GameSetup.module.css'
import { SubmitButton } from '../../components/Buttons'
import { theme } from '../../theme'

interface StartSectionProps {
  handleStartGame: (gameMode: GameMode) => void
}

const StartSection = ({ handleStartGame }: StartSectionProps) => {
  const [gameMode, setGameMode] = useState<GameMode>(GameMode.Normal)

  return (
    <section className={styles.startContainer}>
      <div className={styles.gameModeSelectContainer}>
        <label htmlFor='gameModeSelect'>Game mode:</label>
        <select
          id='gameModeSelect'
          className={styles.gameModeSelect}
          value={gameMode}
          onChange={e => setGameMode(e.target.value as GameMode)}
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
          onClick={() => handleStartGame(gameMode)}
          label='Start game'
          customStyles={{ fontWeight: theme.fontWeights.bold }}
        />
      </div>
    </section>
  )
}

export default StartSection
