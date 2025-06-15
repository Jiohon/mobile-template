import { ReactNode, useEffect } from "react"

import { SpinLoading } from "antd-mobile"
import { useLocation, useNavigate } from "react-router"

import { useAuthStore } from "@/stores/auth"

interface AuthGuardProps {
  children: ReactNode
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, isLoading } = useAuthStore()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // 保存当前路径，登录后可以跳转回来
      const currentPath = location.pathname + location.search

      // 如果当前路径不是根路径，则保存到 state 中
      if (currentPath !== "/") {
        navigate("/login", {
          replace: true,
          state: { from: currentPath },
        })
      } else {
        navigate("/login", { replace: true })
      }
    }
  }, [isAuthenticated, isLoading, navigate, location])

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <SpinLoading style={{ "--size": "48px" }} />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}

export default AuthGuard
