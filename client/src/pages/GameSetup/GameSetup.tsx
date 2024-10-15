import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import styles from './GameSetup.module.css'
import playerService from '../../services/players'
import {
  Game,
  GameMode,
  GameParticipant,
  LocalStorageKey,
  Player,
  Team,
} from '../../types'
import {
  getGameParticipantId,
  getParticipantDisplayName,
  removeFromList,
} from '../../utils'
import teamService from '../../services/teams'
import gameService from '../../services/games'
import PlayerAddSection from './PlayerAddSection'
import PlayerListSection from './PlayerListSection'
import StartSection from './StartSection'
import ConfirmScreen from '../../components/ConfirmScreen'
import { DragAndDrop } from '../../components/DragAndDrop'

const GameSetup = () => {
  const [playerListFromApi, setPlayerListFromApi] = useState<Player[]>([])
  const [playersForGame, setPlayersForGame] = useState<Player[]>([])
  const [singlePlayerList, setSinglePlayerList] = useState<Player[]>([])
  const [teamList, setTeamList] = useState<Team[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [showConfirmScreen, setShowConfirmScreen] = useState<boolean>(false)
  const [gameMode, setGameMode] = useState<GameMode>(GameMode.Normal)
  const [gameParticipants, setGameParticipants] = useState<GameParticipant[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    setIsLoading(true)

    const getData = async () => {
      const existingPlayers = await playerService.getAll()
      setPlayerListFromApi(existingPlayers)
    }
    getData()

    const storagePlayersForGame = JSON.parse(
      window.localStorage.getItem(LocalStorageKey.AllPlayersList) || '{}'
    )
    if (Object.keys(storagePlayersForGame).length > 0) {
      setPlayersForGame(storagePlayersForGame as Player[])
    }

    const storageSinglePlayerList = JSON.parse(
      window.localStorage.getItem(LocalStorageKey.SinglePlayerList) || '{}'
    )
    if (Object.keys(storageSinglePlayerList).length > 0) {
      setSinglePlayerList(storageSinglePlayerList as Player[])
    }

    const storageTeamList = JSON.parse(
      window.localStorage.getItem(LocalStorageKey.TeamList) || '{}'
    )
    if (Object.keys(storageTeamList).length > 0) {
      setTeamList(storageTeamList as Team[])
    }

    setIsLoading(false)
  }, [])

  const updateAllPlayers = (newList: Player[]) => {
    setPlayersForGame(newList)
    window.localStorage.setItem(
      LocalStorageKey.AllPlayersList,
      JSON.stringify(newList)
    )
  }

  const updateSinglePlayers = (newList: Player[]) => {
    setSinglePlayerList(newList)
    window.localStorage.setItem(
      LocalStorageKey.SinglePlayerList,
      JSON.stringify(newList)
    )
  }

  const updateTeams = (newList: Team[]) => {
    setTeamList(newList)
    window.localStorage.setItem(LocalStorageKey.TeamList, JSON.stringify(newList))
  }

  const handleAddPlayer = (player: Player) => {
    updateAllPlayers([...playersForGame, player])
    updateSinglePlayers([...singlePlayerList, player])
  }

  const handleAddTeam = (team: Team) => {
    // Add to teamlist
    updateTeams([...teamList, team])
    // Remove team members from singleplayer list
    let newSinglePlayerList = [...singlePlayerList]

    team.members.forEach((member: Player) => {
      newSinglePlayerList = removeFromList(newSinglePlayerList, member)
    })

    updateSinglePlayers(newSinglePlayerList)
  }

  const removePlayer = (player: Player) => {
    updateAllPlayers(removeFromList(playersForGame, player))
    updateSinglePlayers(removeFromList(singlePlayerList, player))
  }

  const removeTeam = async (team: Team) => {
    let newAllPlayerList = [...playersForGame]

    team.members.forEach((member: Player) => {
      newAllPlayerList = removeFromList(newAllPlayerList, member)
    })

    updateAllPlayers(newAllPlayerList)
    updateTeams(removeFromList(teamList, team))
    await teamService.deleteFromDb(team.id)
  }

  const prepareStartGame = async () => {
    // Convert players and teams to GameParticipant
    const convertedPlayerList: GameParticipant[] = singlePlayerList.map(
      (player: Player) => {
        return {
          participant: player,
          isTeam: false,
          score: 0,
          turnsUsed: 0,
          inTurnIndex: 0, // Temporary
          wordsPlayed: [],
        } as GameParticipant
      }
    )

    const convertedTeamList: GameParticipant[] = teamList.map((team: Team) => {
      return {
        participant: team,
        isTeam: true,
        score: 0,
        turnsUsed: 0,
        inTurnIndex: 0, // Temporary
        wordsPlayed: [],
      } as GameParticipant
    })

    const participants: GameParticipant[] = [
      ...convertedPlayerList,
      ...convertedTeamList,
    ]
    setGameParticipants(participants)
    setShowConfirmScreen(true)
  }

  const startGame = async () => {
    // Order based on the drag & drop result
    const orderedParticipants = gameParticipants.map(
      (entry: GameParticipant, index: number) => ({
        ...entry,
        inTurnIndex: index + 1,
      })
    )
    // Start game in db
    const game: Game = await gameService.create(gameMode, orderedParticipants)

    updateAllPlayers([])
    updateSinglePlayers([])
    updateTeams([])

    navigate(`/game/${game.id}`)
  }

  if (isLoading) {
    return <section className={styles.container}>Loading...</section>
  }

  return (
    <main className={styles.container}>
      <PlayerAddSection
        playerListFromApi={playerListFromApi}
        playersForGame={playersForGame}
        handleAddPlayer={handleAddPlayer}
      />
      <PlayerListSection
        playersForGame={playersForGame}
        teamList={teamList}
        singlePlayerList={singlePlayerList}
        removePlayer={removePlayer}
        removeTeam={removeTeam}
        handleAddTeam={handleAddTeam}
      />
      {singlePlayerList.length + teamList.length > 1 && (
        <StartSection
          gameMode={gameMode}
          setGameMode={setGameMode}
          onStart={prepareStartGame}
        />
      )}
      <ConfirmScreen
        show={showConfirmScreen}
        onCancel={() => setShowConfirmScreen(false)}
        onConfirm={startGame}
      >
        <div>
          Define playing order (drag and drop)
          <DragAndDrop
            items={gameParticipants}
            setItems={setGameParticipants}
            getId={getGameParticipantId}
            getContent={getParticipantDisplayName}
          />
        </div>
      </ConfirmScreen>
    </main>
  )
}

export default GameSetup
