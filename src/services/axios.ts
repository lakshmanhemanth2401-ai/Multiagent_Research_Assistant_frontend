import axios, { type InternalAxiosRequestConfig } from 'axios'
import { storage } from './storage'
import { STORAGE_KEYS } from '@/utils/constants'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000',
  timeout: 30_000,
  headers: { 'Content-Type': 'application/json' },
})

// ─── request: attach access-token ─────────────────────────────────────────────
apiClient.interceptors.request.use(
  (config) => {
    const token = storage.get<string>(STORAGE_KEYS.ACCESS_TOKEN)
    if (token) config.headers.Authorization = 'Bearer ' + token
    return config
  },
  (error) => Promise.reject(error),
)

// ─── response: silent token-refresh + session expiry ──────────────────────────
let isRefreshing = false
let pendingQueue: Array<{
  resolve: (token: string) => void
  reject: (err: unknown) => void
}> = []

function flushQueue(token: string | null, error: unknown = null) {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (token) resolve(token)
    else reject(error)
  })
  pendingQueue = []
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error)
    }

    // Mark so we don't loop
    original._retry = true

    const refreshToken = storage.get<string>(STORAGE_KEYS.REFRESH_TOKEN)

    if (!refreshToken) {
      // No refresh token — hard logout via store (lazy import to avoid circular dep)
      import('@/store/auth.store').then(({ useAuthStore }) => {
        useAuthStore.getState().expireSession()
        window.location.replace('/session-expired')
      })
      return Promise.reject(error)
    }

    if (isRefreshing) {
      // Queue this request until refresh resolves
      return new Promise((resolve, reject) => {
        pendingQueue.push({
          resolve: (token) => {
            original.headers.Authorization = 'Bearer ' + token
            resolve(apiClient(original))
          },
          reject,
        })
      })
    }

    isRefreshing = true
    try {
      // Inline call to avoid circular service imports
      const resp = await axios.post<{ access_token: string; expires_in: number }>(
        `${import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'}/auth/refresh`,
        { refresh_token: refreshToken },
      )
      const newToken = resp.data.access_token
      storage.set(STORAGE_KEYS.ACCESS_TOKEN, newToken)
      import('@/store/auth.store').then(({ useAuthStore }) => {
        useAuthStore.getState().setAccessToken(newToken)
      })
      flushQueue(newToken)
      original.headers.Authorization = 'Bearer ' + newToken
      return apiClient(original)
    } catch (refreshError) {
      flushQueue(null, refreshError)
      storage.remove(STORAGE_KEYS.ACCESS_TOKEN)
      storage.remove(STORAGE_KEYS.REFRESH_TOKEN)
      import('@/store/auth.store').then(({ useAuthStore }) => {
        useAuthStore.getState().expireSession()
        window.location.replace('/session-expired')
      })
      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  },
)

export default apiClient
