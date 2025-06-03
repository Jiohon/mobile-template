import { Card, List, Switch } from "antd-mobile"
import { RightOutline } from "antd-mobile-icons"

import styles from "./index.module.less"

const Settings: React.FC = () => {
  return (
    <div className={styles.container}>
      <Card title="通用设置">
        <List>
          <List.Item prefix="🌙" title="深色模式" extra={<Switch />} />
          <List.Item prefix="🔔" title="推送通知" extra={<Switch defaultChecked />} />
          <List.Item prefix="📳" title="震动反馈" extra={<Switch defaultChecked />} />
        </List>
      </Card>

      <Card title="隐私设置">
        <List>
          <List.Item prefix="🔒" title="隐私设置" clickable arrow={<RightOutline />} />
          <List.Item prefix="🗂" title="数据管理" clickable arrow={<RightOutline />} />
        </List>
      </Card>

      <Card title="帮助与支持">
        <List>
          <List.Item prefix="❓" title="帮助中心" clickable arrow={<RightOutline />} />
          <List.Item prefix="💬" title="意见反馈" clickable arrow={<RightOutline />} />
          <List.Item
            prefix="📊"
            title="检查更新"
            description="v1.0.0"
            clickable
            arrow={<RightOutline />}
          />
        </List>
      </Card>
    </div>
  )
}

export default Settings
