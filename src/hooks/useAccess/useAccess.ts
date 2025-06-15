import { useMemo } from "react"

import { UseAccessReturnType } from "@/hooks/useAccess/types"
import { useAuthStore } from "@/stores/auth"

import access from "./access"

/**
 * useAccess Hook - 参考 @umijs/plugin-access 设计
 * 用于在组件中获取权限信息
 * @returns 权限对象
 */
export const useAccess = (): UseAccessReturnType => {
  const { user } = useAuthStore()

  // 使用 useMemo 优化性能，避免每次渲染都重新计算权限
  const accessPermissions = useMemo(() => {
    return access({ user })
  }, [user])

  return accessPermissions
}

export default useAccess
