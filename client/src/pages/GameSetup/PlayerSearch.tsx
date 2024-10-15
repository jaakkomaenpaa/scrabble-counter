import {
  ChangeEvent,
  MouseEvent as MouseEventReact,
  useEffect,
  useRef,
  useState,
} from 'react'
import Modal from '../../components/Modal'
import styles from './GameSetup.module.css'
import { ModalPosition, Player } from '../../types'

interface PlayerSearchProps {
  playerListFromApi: Player[]
  playersForGame: Player[]
  addPlayer: (player: Player) => void
}

const PlayerSearch = ({
  playerListFromApi,
  playersForGame,
  addPlayer,
}: PlayerSearchProps) => {
  const [searchText, setSearchText] = useState<string>('')
  const [showSearchResults, setShowSearchResults] = useState<boolean>(false)
  const [playerSearchResults, setPlayerSearchResults] = useState<Player[]>([])
  const [searchModalPosition, setSearchModalPosition] = useState<ModalPosition>({
    top: 0,
    left: 0,
  })
  const [searchInputWidth, setSearchInputWidth] = useState<number>()
  const modalRef = useRef<HTMLUListElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleClickOutsideModal = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setShowSearchResults(false)
      }
    }

    if (showSearchResults) {
      document.addEventListener('mousedown', handleClickOutsideModal)
    } else {
      document.removeEventListener('mousedown', handleClickOutsideModal)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutsideModal)
    }
  }, [showSearchResults])

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    displaySearchResults(event.target.value, rect)
  }

  const handleClickSearchInput = (event: MouseEventReact<HTMLInputElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    displaySearchResults(searchText, rect)
    setSearchInputWidth(rect.width)
  }

  const displaySearchResults = (value: string, rect: DOMRect) => {
    const input = value.toLowerCase()
    setSearchText(input)

    const matchingPlayers = playerListFromApi.filter(
      (player: Player) =>
        (player.displayName.toLowerCase().includes(input) ||
          player.fullName.toLowerCase().includes(input)) &&
        playersForGame.every((entry) => entry.id !== player.id)
    )

    setSearchModalPosition({
      top: rect.bottom,
      left: rect.left,
    })

    setPlayerSearchResults(matchingPlayers)
    setShowSearchResults(true)
  }

  const handleClickSearchItem = (player: Player) => {
    addPlayer(player)
    setSearchText('')
    setShowSearchResults(false)
  }

  return (
    <section className={styles.searchContainer}>
      <div className={styles.searchInputWrapper}>
        <input
          id='playerSearch'
          type='search'
          autoComplete='off'
          placeholder=''
          className={styles.searchInput}
          value={searchText}
          onChange={handleSearchChange}
          onClick={handleClickSearchInput}
          ref={searchInputRef}
        />
        <label htmlFor='playerSearch'>Search</label>
      </div>
      <Modal
        show={showSearchResults}
        position={searchModalPosition}
        onClose={() => setShowSearchResults(false)}
        customStyles={{
          width: `${searchInputWidth}px`,
          padding: 0,
        }}
      >
        <ul ref={modalRef} className={styles.searchResultList}>
          {playerSearchResults.length > 0 ? (
            playerSearchResults.map((player: Player) => (
              <li
                className={styles.searchResultItem}
                key={player.id}
                onClick={() => handleClickSearchItem(player)}
              >
                {player.displayName} ({player.fullName})
              </li>
            ))
          ) : (
            <p className={styles.searchNoResultText}>No results</p>
          )}
        </ul>
      </Modal>
    </section>
  )
}

export default PlayerSearch
