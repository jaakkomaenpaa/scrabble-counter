import { useEffect, useState } from 'react'
import {
  Game,
  GameParticipant,
  LetterScore,
  Player,
  Team,
  WordScoreApi,
} from '../../types'
import styles from './Game.module.css'
import WordField from './WordField'
import { formatDate, getTeamDisplayName } from '../../utils'
import { useNavigate, useParams } from 'react-router-dom'
import gameService from '../../services/games'
import { getWordScoreObject } from '../../data/points'
import FinishedGame from './FinishedGame'

const GameView = () => {
  const [inTurnIndex, setInTurnIndex] = useState<number>(0) // Index of the participant whose turn it currently is
  const [turnNumber, setTurnNumber] = useState<number>(1)
  const [players, setPlayers] = useState<GameParticipant[]>([])
  const [currentGame, setCurrentGame] = useState<Game | null>(null)
  const { gameId } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    const getData = async () => {
      if (!gameId) {
        return
      }

      const game = (await gameService.findById(gameId)) as Game

      if (!game) {
        navigate('/error')
        return
      }

      setCurrentGame(game)

      const playerData = game.participants
      setPlayers(playerData)

      const currentRound = playerData[0].turnsUsed
      setTurnNumber(currentRound)

      for (let i = 1; i < playerData.length; i++) {
        if (playerData[i].turnsUsed < currentRound) {
          setInTurnIndex(i)
          break
        }
      }
    }
    
    getData()
  }, [gameId, navigate])

  const setWord = async (
    letters: LetterScore[],
    wordGetsBonus: boolean,
    extraPoints: number
  ) => {
    if (!gameId) {
      // Wonder how one could actually pull this off
      console.error('Faulty path: no game id')
      return
    }

    const wordScore: WordScoreApi = getWordScoreObject(
      letters,
      wordGetsBonus,
      extraPoints,
      turnNumber
    )

    // Update player locally
    const entryToUpdate = players[inTurnIndex]
    const updatedPlayers = [...players]
    const playerToUpdate = { ...updatedPlayers[inTurnIndex] }

    playerToUpdate.score += wordScore.score
    playerToUpdate.turnsUsed = playerToUpdate.turnsUsed + 1
    playerToUpdate.wordsPlayed = [...playerToUpdate.wordsPlayed, wordScore]

    updatedPlayers[inTurnIndex] = playerToUpdate
    setPlayers(updatedPlayers)

    await gameService.updateTurn(entryToUpdate, wordScore, gameId)
    handleTurnOver()
  }

  const handleTurnOver = () => {
    if (inTurnIndex >= players.length - 1) {
      setInTurnIndex(0)
      setTurnNumber(turnNumber + 1)
      return
    }
    setInTurnIndex(inTurnIndex + 1)
  }

  if (!currentGame) {
    return <div>Loading...</div>
  }

  return (
    <div className={styles.container}>
      <div className={styles.gameHeader}>
        <h2>Game</h2>
        <p>{formatDate(currentGame.startDate)}</p>
        <p>{currentGame.mode} mode</p>
      </div>
      {currentGame.isFinished ? (
        <FinishedGame participants={players} />
      ) : (
        <>
          <table className={styles.playerTable}>
            <thead>
              <tr className={styles.tr}>
                <th className={styles.th}>Player / Team</th>
                <th className={styles.th}>Score</th>
                <th className={styles.th}>Turns used</th>
              </tr>
            </thead>
            <tbody>
              {players.map((entry: GameParticipant, index: number) => {
                let participant
                let displayName
                if (entry.isTeam) {
                  participant = entry.participant as Team
                  displayName = getTeamDisplayName(participant)
                } else {
                  participant = entry.participant as Player
                  displayName = participant.displayName
                }

                return (
                  <tr
                    key={index}
                    className={index === inTurnIndex ? styles.trActive : styles.tr}
                  >
                    <td className={styles.td}>{displayName}</td>
                    <td className={styles.td}>{entry.score}</td>
                    <td className={styles.td}>{entry.turnsUsed}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          <WordField setWord={setWord} />
        </>
      )}
    </div>
  )
}

export default GameView
