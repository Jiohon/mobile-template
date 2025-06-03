import { Button, Card, Grid } from "antd-mobile"

import { useAuthStore } from "@/stores/auth"

import styles from "./index.module.less"

const Home: React.FC = () => {
  const { user } = useAuthStore()

  const gridItems = [
    {
      key: "feature1",
      title: "功能1",
      color: "#1677ff",
    },
    {
      key: "feature2",
      title: "功能2",
      color: "#00b96b",
    },
    {
      key: "feature3",
      title: "功能3",
      color: "#ff6b35",
    },
    {
      key: "feature4",
      title: "功能4",
      color: "#722ed1",
    },
  ]

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>欢迎回来，{user?.username}！</h2>
        <p>今天是美好的一天</p>
      </div>

      <Card title="快捷功能" className={styles.card}>
        <Grid columns={2} gap={16}>
          {gridItems.map((item) => (
            <Grid.Item key={item.key}>
              <div className={styles.gridItem} style={{ backgroundColor: item.color }}>
                <div className={styles.gridTitle}>{item.title}</div>
              </div>
            </Grid.Item>
          ))}
        </Grid>
      </Card>

      <Card title="操作面板" className={styles.card}>
        <div className={styles.actions}>
          <Button block color="primary" size="large">
            主要操作
          </Button>
          <Button block fill="outline" size="large">
            次要操作
          </Button>
        </div>
      </Card>
    </div>
  )
}

export default Home
