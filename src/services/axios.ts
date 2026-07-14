import axios from 'axios'
import { storage } from './storage'
import { STORAGE_KEYS } from '@/utils/constants'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 30_000,
  headers: { 'Content-Type': 'application/json' },
})

apiClient.interceptors.request.use(
  (config) => {
    const token = storage.get<string>(STORAGE_KEYS.ACCESS_TOKEN)
    if (token) config.headers.Authorization = 'Bearer ' + token
    return config
  },
  (error) => Promise.reject(error),
)

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      storage.remove(STORAGE_KEYS.ACCESS_TOKEN)
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)

export default apiClient
