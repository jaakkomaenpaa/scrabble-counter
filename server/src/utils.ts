import Player from './classes/Player'
import { TeamWithMembers } from './types'

export const handleActionForPlayerOrTeam = (
  entry: Player | TeamWithMembers,
  isTeam: boolean,
  action: (player: Player, teamId?: number) => void
) => {
  if (isTeam) {
    const team = entry as TeamWithMembers
    team.members.forEach((member: Player) => {
      action(Player.fetchById(member.id), team.id)
    })
  } else {
    const player = entry as Player
    action(Player.fetchById(player.id))
  }
}
