export interface User {
  id: string
  username: string
  email: string
  phone?: string
  avatar?: string
  roles: string[]
  permissions: string[]
  createTime: string
  updateTime: string
}

export interface LoginRequest {
  username: string
  password: string
  captcha?: string
}

export interface LoginResponse {
  token: string
  refreshToken: string
  user: User
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}
