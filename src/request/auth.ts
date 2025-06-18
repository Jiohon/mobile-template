import { createServerTokenAuthentication } from "alova/client"

import { useAuthStore } from "@/stores/auth"

/**
 * 创建 token 认证处理器
 */
export const createAuthHandler = () => {
  return createServerTokenAuthentication({
    refreshTokenOnSuccess: {
      isExpired: (response: Response) => {
        // 检查是否为 401 错误
        return response.status === 401
      },
      handler: async (): Promise<void> => {
        await useAuthStore.getState().reRefreshToken()
      },
    },
  })
}
