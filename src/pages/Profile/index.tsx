import { Avatar, Button, Card, List, Space } from "antd-mobile"
import { RightOutline } from "antd-mobile-icons"
import { useNavigate } from "react-router"

import { Access, useAccess } from "@/hooks/useAccess"
import { useAuthStore } from "@/stores/auth"

import styles from "./index.module.less"

const Profile: React.FC = () => {
  const { user, logout } = useAuthStore()
  const access = useAccess()
  const navigate = useNavigate()
  const handleLogout = () => {
    logout()
  }

  return (
    <div className={styles.container}>
      <Card className={styles.userCard}>
        <Space className={styles.userInfo}>
          <Avatar
            src={user?.avatar || ""}
            fallback={user?.username?.charAt(0)?.toUpperCase() || "头像"}
            style={{ "--size": "64px" }}
          />
          <div className={styles.info}>
            <div className={styles.username}>{user?.username}</div>
            <div className={styles.email}>{user?.email}</div>
          </div>
        </Space>
      </Card>
      <Space direction="vertical" style={{ "--gap": "14px", width: "100%" }}>
        <Card title="账户信息">
          <List style={{ "--border-top": "0", "--border-bottom": "0" }}>
            <List.Item
              prefix="📱"
              title="手机号码"
              description={user?.phone || "未设置"}
              clickable
              arrowIcon={<RightOutline />}
            />
            <List.Item prefix="🔐" title="修改密码" clickable arrowIcon={<RightOutline />} />
            <List.Item prefix="🔔" title="消息通知" clickable arrowIcon={<RightOutline />} />
          </List>
        </Card>

        <Access accessible={access.hasPermission("user:*:*")}>
          <Card title="管理菜单">
            <List style={{ "--border-top": "0", "--border-bottom": "0" }}>
              <List.Item
                prefix="👥"
                title="用户管理"
                clickable
                arrowIcon={<RightOutline />}
                onClick={() => navigate("/admin/users")}
              />
            </List>
          </Card>
        </Access>

        <Card>
          <List style={{ "--border-top": "0", "--border-bottom": "0" }}>
            <List.Item prefix="ℹ️" title="关于我们" clickable arrowIcon={<RightOutline />} />
            <List.Item prefix="📄" title="隐私政策" clickable arrowIcon={<RightOutline />} />
            <List.Item prefix="📞" title="联系我们" clickable arrowIcon={<RightOutline />} />
          </List>
        </Card>

        <div className={styles.logoutSection}>
          <Button block size="large" fill="outline" color="danger" onClick={handleLogout}>
            退出登录
          </Button>
        </div>
      </Space>
    </div>
  )
}

export default Profile
