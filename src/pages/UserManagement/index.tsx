import { Button, Card, List, Space } from "antd-mobile"
import { RightOutline } from "antd-mobile-icons"

const UserManagement: React.FC = () => {
  return (
    <div style={{ padding: "16px", background: "#f5f5f5", minHeight: "100vh" }}>
      <Card title="用户管理">
        <List>
          <List.Item
            prefix="👥"
            title="用户列表"
            description="查看和管理所有用户"
            clickable
            arrow={<RightOutline />}
          />
          <List.Item
            prefix="➕"
            title="添加用户"
            description="创建新用户账号"
            clickable
            arrow={<RightOutline />}
          />
          <List.Item
            prefix="🔒"
            title="权限管理"
            description="设置用户角色和权限"
            clickable
            arrow={<RightOutline />}
          />
        </List>
      </Card>

      <Card title="操作" style={{ marginTop: "16px" }}>
        <Space direction="vertical" style={{ width: "100%" }}>
          <Button block color="primary">
            批量导入用户
          </Button>
          <Button block fill="outline">
            导出用户数据
          </Button>
        </Space>
      </Card>
    </div>
  )
}

export default UserManagement
