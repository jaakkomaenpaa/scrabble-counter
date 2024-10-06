import axios from 'axios'
import { BASE_API_URL } from '../config'
import { Player, Team } from '../types'

const baseUrl = `${BASE_API_URL}/teams`

const findById = async (teamId: string | number): Promise<Team> => {
  const response = await axios.get(`${baseUrl}/${teamId}`)
  return response.data
}

const findByMembers = async (players: Player[]): Promise<Team | null> => {
  const body = { players }

  const response = await axios.post(`${baseUrl}/find`, body)
  console.log('response from findByMembers', response)
  return response.data
}

const addNew = async (teamName: string): Promise<Team> => {
  const body = { teamName }

  const response = await axios.post(`${baseUrl}/add`, body)
  return response.data
}

const updateName = async (
  teamId: string | number,
  newName: string
): Promise<Team> => {
  const body = { newName }

  const response = await axios.put(`${baseUrl}/change-name/${teamId}`, body)
  return response.data
}

const deleteFromDb = async (teamId: string | number): Promise<void> => {
  const response = await axios.delete(`${baseUrl}/delete/${teamId}`)
  return response.data
}

const exports = {
  findById,
  findByMembers,
  addNew,
  updateName,
  deleteFromDb,
}

export default exports