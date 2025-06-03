import { Button, Card, List, Switch } from "antd-mobile"
import { RightOutline } from "antd-mobile-icons"

const SystemSettings: React.FC = () => {
  return (
    <div style={{ padding: "16px", background: "#f5f5f5", minHeight: "100vh" }}>
      <Card title="系统配置">
        <List>
          <List.Item
            prefix="🌐"
            title="网站配置"
            description="网站基本信息设置"
            clickable
            arrow={<RightOutline />}
          />
          <List.Item
            prefix="📧"
            title="邮件配置"
            description="邮件服务器设置"
            clickable
            arrow={<RightOutline />}
          />
          <List.Item
            prefix="🔐"
            title="安全设置"
            description="系统安全策略配置"
            clickable
            arrow={<RightOutline />}
          />
        </List>
      </Card>

      <Card title="功能开关" style={{ marginTop: "16px" }}>
        <List>
          <List.Item
            prefix="🔔"
            title="用户注册"
            description="是否允许新用户注册"
            extra={<Switch defaultChecked />}
          />
          <List.Item
            prefix="📱"
            title="短信验证"
            description="登录时是否需要短信验证"
            extra={<Switch />}
          />
          <List.Item
            prefix="🎨"
            title="深色模式"
            description="默认开启深色模式"
            extra={<Switch />}
          />
        </List>
      </Card>

      <Card title="系统维护" style={{ marginTop: "16px" }}>
        <div style={{ padding: "16px 0" }}>
          <Button block color="warning" style={{ marginBottom: "12px" }}>
            清理系统缓存
          </Button>
          <Button block color="danger">
            重启系统服务
          </Button>
        </div>
      </Card>
    </div>
  )
}

export default SystemSettings
