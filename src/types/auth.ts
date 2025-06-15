import { PermissionsType } from "./router"

export interface User {
  id: string
  username: string
  email: string
  phone?: string
  avatar?: string
  roles: string[]
  permissions: PermissionsType[]
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
