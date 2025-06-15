import { Button, ErrorBlock } from "antd-mobile"
import { useNavigate } from "react-router"

const NotFound: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div style={{ padding: "20px" }}>
      <ErrorBlock status="empty" title="页面不存在" description="抱歉，您访问的页面不存在" />
      <div style={{ marginTop: "20px" }}>
        <Button block color="primary" onClick={() => navigate("/", { replace: true })}>
          返回首页
        </Button>
      </div>
    </div>
  )
}

export default NotFound
