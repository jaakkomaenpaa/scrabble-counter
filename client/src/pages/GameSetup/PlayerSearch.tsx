import {
  ChangeEvent,
  MouseEvent as MouseEventReact,
  useEffect,
  useRef,
  useState,
} from 'react'
import styles from './GameSetup.module.css'
import { Player } from '../../types'

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
  const searchInputRef = useRef<HTMLInputElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)
  const [isSmallScreen, setIsSmallScreen] = useState<boolean>(false)

  useEffect(() => {
    setIsSmallScreen(window.innerWidth <= 600)

    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 600)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  useEffect(() => {
    const handleClickOutsideModal = (event: MouseEvent) => {
      if (
        resultsRef.current &&
        !resultsRef.current.contains(event.target as Node) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setShowSearchResults(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutsideModal)

    return () => {
      document.removeEventListener('mousedown', handleClickOutsideModal)
    }
  }, [showSearchResults])

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    displaySearchResults(event.target.value, rect)
  }

  const handleClickSearchInput = (event: MouseEventReact<HTMLInputElement>) => {
    if (searchInputRef.current) {
      // Timeout needed for this to work on mobile
      setTimeout(() => {
        searchInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    }

    const rect = event.currentTarget.getBoundingClientRect()
    displaySearchResults(searchText, rect)
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
          placeholder={isSmallScreen ? 'Search' : ''}
          className={styles.searchInput}
          value={searchText}
          onChange={handleSearchChange}
          onClick={handleClickSearchInput}
          ref={searchInputRef}
          onFocus={(e) => e.preventDefault()}
        />
        <label htmlFor='playerSearch'>Search</label>
        {showSearchResults && (
          <div ref={resultsRef} className={styles.searchResultList}>
            {playerSearchResults.map((player: Player) => (
              <div
                className={styles.searchResultItem}
                key={player.id}
                onClick={() => handleClickSearchItem(player)}
              >
                {player.displayName} ({player.fullName})
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default PlayerSearch
