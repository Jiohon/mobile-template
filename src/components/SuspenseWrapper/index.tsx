import { Suspense } from "react"

import { SpinLoading } from "antd-mobile"

// 加载组件的 Suspense 包装器
const SuspenseWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense
    fallback={
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
    }
  >
    {children}
  </Suspense>
)

export default SuspenseWrapper
