import { Avatar, Button, Card, List } from "antd-mobile"
import { RightOutline } from "antd-mobile-icons"

import { useAuthStore } from "@/stores/auth"

import styles from "./index.module.less"

const Profile: React.FC = () => {
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
  }

  return (
    <div className={styles.container}>
      <Card className={styles.userCard}>
        <div className={styles.userInfo}>
          <Avatar
            src={user?.avatar || ""}
            fallback={user?.username?.charAt(0)?.toUpperCase() || "头像"}
            style={{ "--size": "64px" }}
          />
          <div className={styles.info}>
            <div className={styles.username}>{user?.username}</div>
            <div className={styles.email}>{user?.email}</div>
          </div>
        </div>
      </Card>

      <Card title="账户信息">
        <List>
          <List.Item
            prefix="📱"
            title="手机号码"
            description={user?.phone || "未设置"}
            clickable
            arrow={<RightOutline />}
          />
          <List.Item prefix="🔐" title="修改密码" clickable arrow={<RightOutline />} />
          <List.Item prefix="🔔" title="消息通知" clickable arrow={<RightOutline />} />
        </List>
      </Card>

      <Card title="其他">
        <List>
          <List.Item prefix="ℹ️" title="关于我们" clickable arrow={<RightOutline />} />
          <List.Item prefix="📄" title="隐私政策" clickable arrow={<RightOutline />} />
          <List.Item prefix="📞" title="联系我们" clickable arrow={<RightOutline />} />
        </List>
      </Card>

      <div className={styles.logoutSection}>
        <Button block size="large" fill="outline" color="danger" onClick={handleLogout}>
          退出登录
        </Button>
      </div>
    </div>
  )
}

export default Profile
