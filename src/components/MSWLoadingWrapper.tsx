import { ReactNode, useEffect, useState } from "react"

import { Button, ErrorBlock, SpinLoading } from "antd-mobile"

interface MSWLoadingWrapperProps {
  children: ReactNode
  onMSWReady: () => Promise<void>
  enableMock: boolean
}

type MSWStatus = "loading" | "ready" | "error" | "disabled"

const MSWLoadingWrapper: React.FC<MSWLoadingWrapperProps> = ({
  children,
  onMSWReady,
  enableMock,
}) => {
  const [status, setStatus] = useState<MSWStatus>(enableMock ? "loading" : "disabled")
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  const initializeMSW = async () => {
    if (!enableMock) {
      setStatus("disabled")
      return
    }

    try {
      setStatus("loading")
      setError(null)

      console.log("🔧 [MSWLoadingWrapper] Starting MSW initialization...")
      await onMSWReady()

      console.log("✅ [MSWLoadingWrapper] MSW ready!")
      setStatus("ready")
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error"
      console.error("❌ [MSWLoadingWrapper] MSW initialization failed:", errorMessage)
      setError(errorMessage)
      setStatus("error")
    }
  }

  useEffect(() => {
    initializeMSW()
  }, [])

  const handleRetry = () => {
    setRetryCount((count) => count + 1)
    initializeMSW()
  }

  // 如果不需要Mock，直接渲染子组件
  if (status === "disabled") {
    return <>{children}</>
  }

  // 如果MSW已就绪，渲染子组件
  if (status === "ready") {
    return <>{children}</>
  }

  // 加载状态
  if (status === "loading") {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          padding: "20px",
          background: "#f5f5f5",
        }}
      >
        <SpinLoading style={{ "--size": "48px", "--color": "#1677ff" }} />
        <div
          style={{
            marginTop: "16px",
            fontSize: "16px",
            color: "#666",
            textAlign: "center",
          }}
        >
          正在启动Mock服务...
        </div>
        <div
          style={{
            marginTop: "8px",
            fontSize: "14px",
            color: "#999",
            textAlign: "center",
          }}
        >
          首次启动可能需要几秒钟
        </div>
        {retryCount > 0 && (
          <div
            style={{
              marginTop: "8px",
              fontSize: "12px",
              color: "#ff6b35",
              textAlign: "center",
            }}
          >
            重试第 {retryCount} 次
          </div>
        )}
      </div>
    )
  }

  // 错误状态
  if (status === "error") {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          padding: "20px",
          background: "#f5f5f5",
        }}
      >
        <ErrorBlock
          status="disconnected"
          title="Mock服务启动失败"
          description={
            <div style={{ textAlign: "center" }}>
              <div style={{ marginBottom: "8px" }}>错误信息: {error}</div>
              <div style={{ fontSize: "12px", color: "#999" }}>
                这可能是由于浏览器不支持Service Worker或网络问题导致的
              </div>
            </div>
          }
        />
        <div style={{ marginTop: "16px", display: "flex", gap: "12px" }}>
          <Button color="primary" size="middle" onClick={handleRetry} disabled={retryCount >= 3}>
            {retryCount >= 3 ? "重试次数已达上限" : "重试"}
          </Button>
          <Button
            color="default"
            size="middle"
            onClick={() => {
              setStatus("disabled")
              console.log("🔧 [MSWLoadingWrapper] User skipped MSW, continuing without mock")
            }}
          >
            跳过Mock服务
          </Button>
        </div>
        {retryCount >= 3 && (
          <div
            style={{
              marginTop: "16px",
              padding: "12px",
              background: "#fff3cd",
              border: "1px solid #ffeaa7",
              borderRadius: "4px",
              fontSize: "12px",
              color: "#856404",
              textAlign: "center",
            }}
          >
            <strong>建议：</strong>
            <br />
            1. 刷新页面重试
            <br />
            2. 检查浏览器是否支持Service Worker
            <br />
            3. 尝试使用隐私模式访问
          </div>
        )}
      </div>
    )
  }

  return null
}

export default MSWLoadingWrapper
