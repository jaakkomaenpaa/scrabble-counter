import { KeyboardEvent, MouseEvent, useRef, useState } from 'react'
import { IoStarOutline } from 'react-icons/io5'

import styles from './Game.module.css'
import { Bonus, Letter, LetterScore } from '../../types'
import Modal from '../../components/Modal'

const emptyField: LetterScore = {
  letter: Letter.NoLetter,
  bonus: Bonus.NoBonus,
}

interface WordInputProps {
  letters: LetterScore[]
  setLetters: (letters: LetterScore[]) => void
}

const WordInput = ({ letters, setLetters }: WordInputProps) => {
  const [showModal, setShowModal] = useState<boolean>(false)
  const [activeLetterIndex, setActiveLetterIndex] = useState<number | null>(null)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const setFocus = (index: number) => {
    setTimeout(() => {
      inputRefs.current[index]?.focus()
    }, 0)
  }

  const handleKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace') {
      deleteLetter(index)
      setFocus(index - 1)
      return
    }

    if (event.key === 'Delete') {
      deleteLetter(index)
      setFocus(index >= letters.length - 1 ? letters.length - 2 : index)
      return
    }

    if (event.key === 'ArrowLeft') {
      setFocus(index - 1)
      return
    }

    if (event.key === 'ArrowRight') {
      setFocus(index + 1)
      return
    }

    const key = event.key.toUpperCase() as Letter

    if (Object.values(Letter).includes(key)) {
      addLetter(key, index)
    }

    // NEW CHANGE
    event.preventDefault()
  }

  const addLetter = (letter: Letter, index: number) => {
    const newLetter = {
      letter,
      bonus: Bonus.NoBonus,
    }

    if (letters[0].letter === Letter.NoLetter) {
      setLetters([newLetter])
      return
    }

    setLetters([
      ...letters.slice(0, index + 1),
      newLetter,
      ...letters.slice(index + 1),
    ])
    setFocus(index + 1)
  }

  const deleteLetter = (index: number) => {
    if (letters.length === 1) {
      setLetters([emptyField])
      return
    }

    setLetters([...letters.slice(0, index), ...letters.slice(index + 1)])
  }

  const handleLetterClick = (event: MouseEvent<HTMLButtonElement>, index: number) => {
    if (index === activeLetterIndex && showModal) {
      setShowModal(false)
      return
    }

    setActiveLetterIndex(index)
    setShowModal(true)
  }

  const handleBonus = (bonus: Bonus) => {
    if (activeLetterIndex === null) return

    const updatedLetter = { ...letters[activeLetterIndex], bonus }
    const updatedLetterList = [...letters]
    updatedLetterList[activeLetterIndex] = updatedLetter

    setLetters(updatedLetterList)
    setShowModal(!showModal)
  }

  return (
    <div className={styles.wordContainer}>
      {letters.map((letter: LetterScore, index: number) => (
        <div key={index} className={styles.letterWrapper}>
          {activeLetterIndex === index && (
            <Modal
              show={showModal}
              onClose={() => setShowModal(false)}
              position={{ top: 0, left: 0 }}
              occupyWholeScreen={true}
            >
              <div className={styles.bonusSelect}>
                {Object.values(Bonus).map((bonus) => (
                  <button
                    key={bonus}
                    className={styles.bonusButton}
                    onClick={() => handleBonus(bonus)}
                  >
                    {bonus}
                  </button>
                ))}
              </div>
            </Modal>
          )}

          <button
            className={
              letter.bonus !== Bonus.NoBonus
                ? styles.bonusLabelActive
                : styles.bonusLabel
            }
            onClick={(e) => handleLetterClick(e, index)}
          >
            {letter.bonus !== Bonus.NoBonus ? (
              letter.bonus
            ) : (
              <IoStarOutline className={styles.addBonusIcon} size={20} />
            )}
          </button>
          <input
            className={styles.letterInput}
            type='text'
            defaultValue={letter.letter}
            maxLength={1}
            onKeyDown={(e) => handleKeyDown(index, e)}
            ref={(el) => (inputRefs.current[index] = el)}
          />
        </div>
      ))}
    </div>
  )
}

export default WordInput
