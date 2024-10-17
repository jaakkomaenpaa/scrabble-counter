import { GameParticipant, Player, Team } from './types'

export const getTeamDisplayName = (team: Team) => {
  const memberNames = team.members
    .map((member: Player) => member.displayName)
    .join(', ')
  return `${team.name} (${memberNames})`
}

export const removeFromList = <T extends { id: number }>(
  list: T[],
  entry: T
): T[] => {
  const updatedList = list.filter((e) => e.id !== entry.id)
  return updatedList
}

export const themeToCssVariables = (theme: Record<string, any>) => {
  const toCssVariables = (obj: Record<string, any>, prefix: string = '--') => {
    return Object.entries(obj)
      .map(([key, value]): string => {
        if (typeof value === 'object') {
          return toCssVariables(value, `${prefix}${key}-`)
        }
        return `${prefix}${key}: ${value};`
      })
      .join('\n')
  }
  return toCssVariables(theme)
}

export const formatDate = (date: Date): string => {
  let day = date.getDate().toString()
  let month = (date.getMonth() + 1).toString()
  const year = date.getFullYear()
  let hours = date.getHours().toString()
  let minutes = date.getMinutes().toString()

  if (day.length === 1) {
    day = '0' + day
  }

  if (month.length === 1) {
    month = '0' + month
  }

  if (hours.length === 1) {
    hours = '0' + hours
  }

  if (minutes.length === 1) {
    minutes += '0'
  }

  return `${day}/${month}/${year} - ${hours}:${minutes}`
}

export const getGameParticipantId = (entry: GameParticipant): string => {
  if (entry.isTeam) {
    const team: Team = entry.participant as Team
    return team.members[0].id.toString()
  }

  const player: Player = entry.participant as Player
  return player.id.toString()
}

export const getParticipantDisplayName = (entry: GameParticipant): string => {
  if (entry.isTeam) {
    const team: Team = entry.participant as Team
    return getTeamDisplayName(team)
  }

  const player: Player = entry.participant as Player
  return player.displayName
}

export const sleep = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}