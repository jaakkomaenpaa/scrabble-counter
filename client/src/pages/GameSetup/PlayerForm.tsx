import { FormEvent, useState } from 'react'
import Modal from '../../components/Modal'
import styles from './GameSetup.module.css'
import { Player } from '../../types'
import playerService from '../../services/players'

interface PlayerFormProps {
  addPlayer: (player: Player) => void
}

const PlayerForm = ({ addPlayer }: PlayerFormProps) => {
  const [showAddModal, setShowAddModal] = useState<boolean>(false)
  const [playerFullName, setPlayerFullName] = useState<string>('')
  const [playerDisplayName, setPlayerDisplayName] = useState<string>('')

  const handleAddNewPlayer = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const player = await playerService.addNew(playerFullName, playerDisplayName)
    addPlayer(player)
    closeModal()
  }

  const closeModal = () => {
    setPlayerFullName('')
    setShowAddModal(false)
    setPlayerDisplayName('')
  }

  return (
    <section className={styles.addNewContainer}>
      <button className={styles.showFormButton} onClick={() => setShowAddModal(true)}>
        + Add new
      </button>
      <Modal
        show={showAddModal}
        position={{ top: 0, left: 0 }}
        onClose={() => setShowAddModal(false)}
        includeCloseButton={true}
        occupyWholeScreen={true}
      >
        <form onSubmit={handleAddNewPlayer} className={styles.playerForm}>
          <h3>New player:</h3>
          <div className={styles.inputWrapper}>
            <input
              id='fullNameInput'
              className={styles.playerFormInput}
              placeholder=''
              type='text'
              autoComplete='off'
              value={playerFullName}
              onChange={e => setPlayerFullName(e.target.value)}
            />
            <label htmlFor='fullNameInput'>Full name</label>
          </div>
          <div className={styles.inputWrapper}>
            <input
              id='displayNameInput'
              className={styles.playerFormInput}
              placeholder=''
              type='text'
              autoComplete='off'
              value={playerDisplayName}
              onChange={e => setPlayerDisplayName(e.target.value)}
            />
            <label htmlFor='displayNameInput'>Display name</label>
          </div>
          <button type='submit' className={styles.addPlayerButton}>
            Add player
          </button>
        </form>
      </Modal>
    </section>
  )
}

export default PlayerForm
