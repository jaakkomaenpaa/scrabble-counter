import { MouseEvent, useState } from 'react'
import Modal from '../../components/Modal'
import styles from './GameSetup.module.css'
import { Player, Team } from '../../types'
import teamService from '../../services/teams'
import { IoCheckbox } from 'react-icons/io5'
import { removeFromList } from '../../utils'
import { BackButton, ContinueButton, SubmitButton } from '../../components/Buttons'

interface TeamSelectProps {
  singlePlayerList: Player[]
  addTeam: (team: Team) => void
}

const TeamSelect = ({ singlePlayerList, addTeam }: TeamSelectProps) => {
  const [showSelectModal, setShowSelectModal] = useState<boolean>(false)
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([])
  const [page, setPage] = useState<number>(1)
  const [existingTeam, setExistingTeam] = useState<Team | null>(null)
  const [teamName, setTeamName] = useState<string>('')
  const [newTeamName, setNewTeamName] = useState<string>('')

  const handleAddPlayer = (player: Player) => {
    setSelectedPlayers([...selectedPlayers, player])
  }

  const handleRemovePlayer = (player: Player) => {
    setSelectedPlayers(removeFromList(selectedPlayers, player))
  }

  const submitPlayers = async () => {
    if (selectedPlayers.length < 2) {
      return
    }
    const team = await teamService.findByMembers(selectedPlayers)

    if (team) {
      setExistingTeam(team)
    } else {
      setExistingTeam(null)
    }

    setPage(2)
  }

  const handleNameChange = async () => {
    if (!existingTeam) {
      console.error('Faulty path: no existing team')
      return
    }

    const team = await teamService.updateName(existingTeam.id, newTeamName)
    addTeam(team)
    closeModal()
  }

  const createTeam = async () => {
    if (teamName.length < 4) {
      return
    }

    let team = await teamService.addNew(teamName)
    team.members = [...selectedPlayers]

    addTeam(team)
    closeModal()
  }

  const addTeamToGame = () => {
    if (!existingTeam) {
      console.error('Faulty path: no existing team')
      return
    }

    const team = {
      ...existingTeam,
      members: [...selectedPlayers],
    }
    addTeam(team)
    closeModal()
  }

  const closeModal = () => {
    setShowSelectModal(false)
    setPage(1)
    setTeamName('')
    setSelectedPlayers([])
  }

  return (
    <div className={styles.teamSelectContainer}>
      {singlePlayerList.length >= 2 && (
        <button
          className={styles.showFormButton}
          onClick={() => setShowSelectModal(true)}
        >
          + Add a team
        </button>
      )}

      <Modal
        show={showSelectModal}
        position={{ top: 0, left: 0 }}
        onClose={closeModal}
        includeCloseButton={true}
        occupyWholeScreen={true}
      >
        {page === 1 && (
          <div className={styles.modalPage}>
            <h3>Select team members</h3>
            <ul className={styles.playerSelect}>
              {singlePlayerList.map((player: Player) => (
                <PlayerSelectItem
                  key={player.id}
                  player={player}
                  addPlayer={handleAddPlayer}
                  removePlayer={handleRemovePlayer}
                />
              ))}
            </ul>
            <ContinueButton onClick={submitPlayers} />
          </div>
        )}
        {page === 2 && (
          <div className={styles.modalPage}>
            {existingTeam ? (
              <div className={styles.modalInnerPage}>
                <p>These players have an existing team: {existingTeam.name}</p>
                <button
                  className={styles.changeNameButton}
                  onClick={() => setPage(3)}
                >
                  Change name
                </button>
                <div className={styles.buttonContainer}>
                  <SubmitButton onClick={addTeamToGame} />
                  <BackButton onClick={() => setPage(1)} />
                </div>
              </div>
            ) : (
              <div className={styles.modalInnerPage}>
                <h3>New team</h3>
                <p>These players do not have a team yet.</p>
                <div className={styles.teamNameInputWrapper}>
                  <label htmlFor='teamName'>Team name:</label>
                  <input
                    id='teamName'
                    className={styles.teamNameInput}
                    type='text'
                    placeholder='min. 4 characters'
                    autoComplete='off'
                    value={teamName}
                    onChange={e => setTeamName(e.target.value)}
                  />
                </div>
                <div className={styles.buttonContainer}>
                  <SubmitButton onClick={createTeam} />
                  <BackButton onClick={() => setPage(1)} />
                </div>
              </div>
            )}
          </div>
        )}
        {page === 3 && (
          <div className={styles.modalPage}>
            <label htmlFor='newTeamName'>New name:</label>
            <input
              id='newTeamName'
              type='text'
              autoComplete='off'
              value={newTeamName}
              onChange={e => setNewTeamName(e.target.value)}
            />
            <SubmitButton onClick={handleNameChange} />
            <BackButton onClick={() => setPage(2)} />
          </div>
        )}
      </Modal>
    </div>
  )
}

interface PlayerSelectItemProps {
  player: Player
  addPlayer: (player: Player) => void
  removePlayer: (player: Player) => void
}

const PlayerSelectItem = ({
  player,
  addPlayer,
  removePlayer,
}: PlayerSelectItemProps) => {
  const [isSelected, setIsSelected] = useState<boolean>(false)

  const handlePlayerSelect = (event: MouseEvent<HTMLLIElement>) => {
    const isNowSelected = !isSelected
    setIsSelected(isNowSelected)

    if (isNowSelected) {
      addPlayer(player)
    } else {
      removePlayer(player)
    }
  }

  return (
    <li className={styles.playerSelectItem} onClick={handlePlayerSelect}>
      {player.displayName}{' '}
      {isSelected ? <IoCheckbox /> : <div className={styles.emptyBox}></div>}
    </li>
  )
}

export default TeamSelect
