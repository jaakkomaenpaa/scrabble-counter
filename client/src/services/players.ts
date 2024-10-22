import axios from 'axios'
import { BASE_API_URL } from '../config'
import { Player, PlayerWithAllStats, PlayerWithTotalGameStats } from '../types'

const baseUrl = `${BASE_API_URL}/players`

const getAll = async (): Promise<Player[]> => {
  const response = await axios.get(baseUrl)
  return response.data
}

const getOneWithAllStats = async (playerId: string | number): Promise<PlayerWithAllStats> => {
  const response = await axios.get(`${baseUrl}/stats/${playerId}`)
  return response.data
}

const getAllWithTotalGameStats = async (): Promise<PlayerWithTotalGameStats[]> => {  
  const response = await axios.get(`${baseUrl}/stats`)
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
  getOneWithAllStats,
  getAllWithTotalGameStats,
  findById,
  addNew,
}

export default exports
