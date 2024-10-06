import { useEffect, useState } from 'react'

import { Bonus, Letter, LetterScore } from '../../types'
import styles from './Game.module.css'
import { getWordScoreObject } from '../../data/points'
import WordInput from './WordInput'
import { DeleteButton, SubmitButton } from '../../components/Buttons'
import { theme } from '../../theme'
import ConfirmScreen from '../../components/ConfirmScreen'
import { useParams } from 'react-router-dom'
import gameService from '../../services/games'

const emptyField: LetterScore = {
  letter: Letter.NoLetter,
  bonus: Bonus.NoBonus,
}

interface WordFieldProps {
  setWord: (letters: LetterScore[], getsBonus: boolean, extraPoints: number) => void
}

const WordField = ({ setWord }: WordFieldProps) => {
  const [letters, setLetters] = useState<LetterScore[]>([emptyField])
  const [score, setScore] = useState<number>(0)
  const [wordGetsBonus, setWordGetsBonus] = useState<boolean>(false)
  const [extraPoints, setExtraPoints] = useState<string>('')
  const [showConfirmScreen, setShowConfirmScreen] = useState<boolean>(false)
  const { gameId } = useParams()

  useEffect(() => {
    const convertedExtraPoints = parseInt(extraPoints) || 0

    const wordScoreObj = getWordScoreObject(
      letters,
      wordGetsBonus,
      convertedExtraPoints,
      1
    )

    setScore(wordScoreObj.score)
  }, [letters, wordGetsBonus, extraPoints])

  const handleConfirm = () => {
    const convertedExtraPoints = parseInt(extraPoints) || 0

    setWord(letters, wordGetsBonus, convertedExtraPoints)
    setLetters([emptyField])
    setExtraPoints('')
  }

  const finishGame = async () => {
    if (!gameId) {
      return
    }

    await gameService.finish(gameId)
    setShowConfirmScreen(false)
    window.location.reload()
  }

  return (
    <section className={styles.gameFunctionContainer}>
      <div className={styles.wordField}>
        <WordInput letters={letters} setLetters={setLetters} />
        <section className={styles.bonusPointContainer}>
          <div className={styles.bonusCheckContainer}>
            <label htmlFor='bonusCheckbox'>Add bonus?</label>
            <input
              id='bonusCheckbox'
              className={styles.checkbox}
              type='checkbox'
              onClick={() => setWordGetsBonus(!wordGetsBonus)}
            />
          </div>
          <div className={styles.extraPointContainer}>
            <label htmlFor='extraPointsInput'>Add extra points?</label>
            <input
              id='extraPointsInput'
              autoComplete='off'
              className={styles.pointInput}
              type='text'
              value={extraPoints}
              onChange={e => setExtraPoints(e.target.value)}
            />
          </div>
        </section>
        <div>Score: {score}</div>
        <SubmitButton
          onClick={handleConfirm}
          label='Confirm'
          customStyles={{ fontWeight: theme.fontWeights.bold }}
        />
      </div>

      <DeleteButton
        onClick={() => setShowConfirmScreen(true)}
        label='Finish game'
        customStyles={{ paddingLeft: '0.75rem', paddingRight: '0.75rem' }}
      />
      <ConfirmScreen
        show={showConfirmScreen}
        text='Finish this game? It cannot be modified afterwards.'
        onCancel={() => setShowConfirmScreen(false)}
        onConfirm={finishGame}
      />
    </section>
  )
}

export default WordField