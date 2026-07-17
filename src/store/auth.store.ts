import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/types/auth'
import { storage } from '@/services/storage'
import { STORAGE_KEYS } from '@/utils/constants'

interface AuthStore {
  // ─── state ────────────────────────────────────────────────────────────────
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isInitialized: boolean   // true once the store has been hydrated from storage
  isLoading: boolean       // global auth loading (e.g. silent refresh)
  sessionExpired: boolean

  // ─── actions ──────────────────────────────────────────────────────────────
  setUser: (user: User | null) => void
  setTokens: (access: string, refresh: string) => void
  setAccessToken: (token: string | null) => void
  setIsLoading: (loading: boolean) => void
  setInitialized: () => void
  expireSession: () => void
  logout: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isInitialized: false,
      isLoading: false,
      sessionExpired: false,

      setUser: (user) => set({ user, isAuthenticated: !!user }),

      setTokens: (access, refresh) => {
        storage.set(STORAGE_KEYS.ACCESS_TOKEN, access)
        storage.set(STORAGE_KEYS.REFRESH_TOKEN, refresh)
        set({ accessToken: access, refreshToken: refresh })
      },

      setAccessToken: (accessToken) => {
        if (accessToken) storage.set(STORAGE_KEYS.ACCESS_TOKEN, accessToken)
        else storage.remove(STORAGE_KEYS.ACCESS_TOKEN)
        set({ accessToken })
      },

      setIsLoading: (isLoading) => set({ isLoading }),

      setInitialized: () => set({ isInitialized: true }),

      expireSession: () =>
        set({
          sessionExpired: true,
          isAuthenticated: false,
          user: null,
          accessToken: null,
          refreshToken: null,
        }),

      logout: () => {
        storage.remove(STORAGE_KEYS.ACCESS_TOKEN)
        storage.remove(STORAGE_KEYS.REFRESH_TOKEN)
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          sessionExpired: false,
        })
      },
    }),
    {
      name: 'auth-store',
      partialize: (s) => ({
        user: s.user,
        accessToken: s.accessToken,
        refreshToken: s.refreshToken,
        isAuthenticated: s.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setInitialized()
      },
    },
  ),
)
