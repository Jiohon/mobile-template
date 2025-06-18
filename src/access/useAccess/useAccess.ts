import { useMemo } from "react"

import { useAuthStore } from "@/stores/auth"

import { UseAccessReturnType } from "../types"

import createAccess from "./createAccess"

/**
 * useAccess Hook - 参考 @umijs/plugin-access
 * 用于在组件中获取权限信息
 * @returns 权限对象
 */
export const useAccess = (): UseAccessReturnType => {
  const { user, userRolesSet, userPermissionsSet } = useAuthStore()

  const accessPermissions = useMemo(() => {
    return createAccess({ user, userRolesSet, userPermissionsSet })
  }, [user, userRolesSet, userPermissionsSet])

  return accessPermissions
}

export default useAccess
