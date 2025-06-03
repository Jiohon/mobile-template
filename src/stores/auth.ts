import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

import { loginApi, logoutApi, refreshTokenApi } from "@/api"
import { AuthState, User } from "@/types/auth"
import { getToken, removeToken, setToken } from "@/utils/auth"

interface AuthStore extends AuthState {
  login: (data: { username: string; password: string }) => Promise<void>
  logout: () => Promise<void>
  updateUser: (user: Partial<User>) => void
  refreshToken: () => Promise<void>
  checkAuth: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

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
          })
        }
      },

      updateUser: (userData: Partial<User>) => {
        const { user } = get()
        if (user) {
          const updatedUser = { ...user, ...userData }
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

      checkAuth: () => {
        set({ isLoading: true })
        const token = getToken()
        const currentUser = get().user

        if (token) {
          // 如果有token但没有用户信息，可能是持久化存储中的数据丢失，
          // 在真实环境中应该尝试用token请求用户信息
          if (!currentUser) {
            // 这里使用模拟数据，实际项目中应通过API获取
            const mockUser: User = {
              id: "1",
              username: "admin",
              email: "admin@example.com",
              roles: ["admin"],
              permissions: ["user:read", "system:config"],
              createTime: new Date().toISOString(),
              updateTime: new Date().toISOString(),
            }
            set({
              isAuthenticated: true,
              token,
              user: mockUser,
              isLoading: false,
            })
          } else {
            set({
              isAuthenticated: true,
              token,
              isLoading: false,
            })
          }
        } else {
          set({
            isAuthenticated: false,
            token: null,
            user: null,
            isLoading: false,
          })
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
      }),
    }
  )
)
