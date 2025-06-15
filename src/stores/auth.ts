import _ from "lodash"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

import { loginApi, logoutApi, refreshTokenApi } from "@/api"
import { User } from "@/types/auth"
import type { PermissionsType } from "@/types/router"
import { removeToken, setToken } from "@/utils/token"

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  userRolesSet: Set<string>
  userPermissionsSet: Set<PermissionsType>
}

interface AuthStore extends AuthState {
  login: (data: { username: string; password: string }) => Promise<void>
  logout: () => Promise<void>
  updateUser: (user: Partial<User>) => void
  refreshToken: () => Promise<void>
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      userRolesSet: new Set(),
      userPermissionsSet: new Set(),

      getUserPermissionsSet: () => {
        return get().userPermissionsSet
      },

      login: async (data: { username: string; password: string }) => {
        set({ isLoading: true })

        try {
          const response = await loginApi(data)
          const { token, refreshToken, user } = response

          setToken(token)
          localStorage.setItem("refreshToken", refreshToken)

          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            userRolesSet: new Set(user.roles || []),
            userPermissionsSet: new Set(user.permissions || []),
          })
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      logout: async () => {
        try {
          await logoutApi()
        } catch (error) {
          // 忽略登出API错误
        } finally {
          removeToken()
          localStorage.removeItem("refreshToken")
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            userRolesSet: new Set(),
            userPermissionsSet: new Set(),
          })
        }
      },

      updateUser: (userData: Partial<User>) => {
        const { user } = get()
        if (user) {
          const updatedUser = {
            ...user,
            ...userData,
          }
          set({
            user: updatedUser,
          })
        }
      },

      refreshToken: async () => {
        const refreshToken = localStorage.getItem("refreshToken")

        if (!refreshToken) {
          get().logout()
          return
        }

        try {
          const response = await refreshTokenApi(refreshToken)
          const { token, refreshToken: newRefreshToken, user } = response

          setToken(token)
          localStorage.setItem("refreshToken", newRefreshToken)

          set({
            user,
            token,
            isAuthenticated: true,
          })
        } catch (error) {
          get().logout()
          throw error
        }
      },
    }),
    {
      name: "auth-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        userRolesSet: state.userRolesSet,
        userPermissionsSet: state.userPermissionsSet,
      }),
      merge: (persistedState, currentState) => {
        return _.merge(currentState, {
          ...(persistedState as AuthState),
          userRolesSet: new Set((persistedState as AuthState)?.user?.roles || []),
          userPermissionsSet: new Set((persistedState as AuthState)?.user?.permissions || []),
        })
      },
    }
  )
)
