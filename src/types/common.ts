import { ComponentType } from "react"

export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
  success: boolean
}

export interface PageInfo {
  current: number
  pageSize: number
  total: number
}

export interface PageResponse<T = any> extends ApiResponse<T> {
  pageInfo: PageInfo
}

export interface SelectOption {
  label: string
  value: string | number
  disabled?: boolean
}

export interface RouteConfig {
  path: string
  element: ComponentType
  meta?: {
    title?: string
    requireAuth?: boolean
    permissions?: string[]
    roles?: string[]
    icon?: string
    hidden?: boolean
  }
  children?: RouteConfig[]
}
