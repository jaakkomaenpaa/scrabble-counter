import axios from 'axios'
import { BASE_API_URL } from '../config'
import { Player } from '../types'

const baseUrl = `${BASE_API_URL}/players`

const getAll = async (): Promise<Player[]> => {
  const response = await axios.get(baseUrl)
  return response.data
}

const findById = async (playerId: string | number): Promise<Player> => {
  const response = await axios.get(`${baseUrl}/${playerId}`)
  return response.data
}

const addNew = async (fullName: string, displayName: string): Promise<Player> => {
  const body = { fullName, displayName }

  const response = await axios.post(`${baseUrl}/add`, body)
  return response.data
}

const exports = {
  getAll,
  findById,
  addNew,
}

export default exports