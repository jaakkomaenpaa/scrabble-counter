import { GameParticipant, Player, Team } from '../types'

export const TEMP_PARTICIPANTS: GameParticipant[] = [
  {
    participant: {
      id: 1,
      name: 'Team 1',
      members: [
        {
          id: 1,
          displayName: 'P1',
          fullName: 'Player 1',
        },
        {
          id: 2,
          displayName: 'P2',
          fullName: 'Player 2',
        },
      ] as Player[],
    } as Team,
    isTeam: true,
    score: 0,
    turnsUsed: 0,
    wordsPlayed: [],
  },
  {
    participant: {
      id: 3,
      displayName: 'P3',
      fullName: 'Player 3',
    },
    isTeam: false,
    score: 0,
    turnsUsed: 0,
    wordsPlayed: [],
  },
  {
    participant: {
      id: 4,
      name: 'Team 2',
      members: [
        {
          id: 4,
          displayName: 'P4',
          fullName: 'Player 4',
        },
        {
          id: 5,
          displayName: 'P5',
          fullName: 'Player 5',
        },
      ] as Player[],
    } as Team,
    isTeam: true,
    score: 0,
    turnsUsed: 0,
    wordsPlayed: [],
  },
  {
    participant: {
      id: 6,
      displayName: 'P6',
      fullName: 'Player 6',
    },
    isTeam: false,
    score: 0,
    turnsUsed: 0,
    wordsPlayed: [],
  },
]
