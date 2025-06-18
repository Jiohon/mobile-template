import React from "react"

import { Button, Card, Grid, ProgressBar, Space, Tag } from "antd-mobile"
import { FileOutline, TeamOutline, UserOutline } from "antd-mobile-icons"
import { useNavigate } from "react-router"

import { Access, useAccess } from "@/access"

import styles from "./index.module.less"

const Home: React.FC = () => {
  const navigate = useNavigate()
  const access = useAccess()

  // 快捷入口数据
  const quickActions = [
    {
      icon: <FileOutline />,
      title: "表单演示",
      path: "/schema-form-demo",
      color: "#1890ff",
      accessible: true,
    },
    {
      icon: <UserOutline />,
      title: "权限演示",
      path: "/access-demo",
      color: "#52c41a",
      accessible: true,
    },
    {
      icon: <TeamOutline />,
      title: "用户管理",
      path: "/admin/users",
      color: "#fa8c16",
      accessible: access.hasPermission("user:read:*"),
    },
  ]

  // 统计数据
  const statsData = [
    {
      title: "今日访问",
      value: "1,234",
      change: "+12.3%",
      trend: "up",
      color: "#1890ff",
    },
    {
      title: "活跃用户",
      value: "856",
      change: "+5.7%",
      trend: "up",
      color: "#52c41a",
    },
    {
      title: "系统负载",
      value: "67%",
      change: "-2.1%",
      trend: "down",
      color: "#fa8c16",
    },
    {
      title: "存储使用",
      value: "45%",
      change: "+1.2%",
      trend: "up",
      color: "#eb2f96",
    },
  ]

  // 最近活动数据
  const recentActivities = [
    {
      id: 1,
      user: "张三",
      action: "登录系统",
      time: "2分钟前",
      type: "login",
    },
    {
      id: 2,
      user: "李四",
      action: "创建用户",
      time: "15分钟前",
      type: "create",
    },
    {
      id: 3,
      user: "王五",
      action: "修改权限",
      time: "1小时前",
      type: "update",
    },
    {
      id: 4,
      user: "赵六",
      action: "删除数据",
      time: "2小时前",
      type: "delete",
    },
  ]

  // 任务进度数据
  const taskProgress = [
    {
      name: "系统优化",
      progress: 85,
      status: "进行中",
    },
    {
      name: "权限重构",
      progress: 100,
      status: "已完成",
    },
    {
      name: "UI升级",
      progress: 60,
      status: "进行中",
    },
    {
      name: "性能测试",
      progress: 30,
      status: "计划中",
    },
  ]

  const getActivityTypeColor = (type: string) => {
    const colorMap: Record<string, string> = {
      login: "#52c41a",
      create: "#1890ff",
      update: "#fa8c16",
      delete: "#ff4d4f",
    }
    return colorMap[type] || "#666"
  }

  const getTaskStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      已完成: "#52c41a",
      进行中: "#1890ff",
      计划中: "#fa8c16",
    }
    return colorMap[status] || "#666"
  }

  return (
    <Space direction="vertical" block className={styles.container}>
      {/* 快捷入口 */}
      <div className={styles.quickSection}>
        <Card title="快捷入口" className={styles.sectionCard}>
          <Grid columns={3} gap={12}>
            {quickActions.map((action, index) => (
              <Access key={index} accessible={action.accessible}>
                <Grid.Item>
                  <div className={styles.quickItem} onClick={() => navigate(action.path)}>
                    <div className={styles.quickIcon} style={{ backgroundColor: action.color }}>
                      {action.icon}
                    </div>
                    <div className={styles.quickTitle}>{action.title}</div>
                  </div>
                </Grid.Item>
              </Access>
            ))}
          </Grid>
        </Card>
      </div>

      {/* 数据统计 */}
      <div className={styles.statsSection}>
        <Card title="数据概览" className={styles.sectionCard}>
          <Grid columns={2} gap={12}>
            {statsData.map((stat, index) => (
              <Grid.Item key={index}>
                <div className={styles.statItem}>
                  <div className={styles.statValue} style={{ color: stat.color }}>
                    {stat.value}
                  </div>
                  <div className={styles.statTitle}>{stat.title}</div>
                  <div
                    className={styles.statChange}
                    style={{
                      color: stat.trend === "up" ? "#52c41a" : "#ff4d4f",
                    }}
                  >
                    {stat.change}
                  </div>
                </div>
              </Grid.Item>
            ))}
          </Grid>
        </Card>
      </div>

      {/* 任务进度 */}
      <Access accessible={access.isAdmin}>
        <div className={styles.taskSection}>
          <Card title="项目进度" className={styles.sectionCard}>
            <Space direction="vertical" style={{ width: "100%" }}>
              {taskProgress.map((task, index) => (
                <div key={index} className={styles.taskItem}>
                  <div className={styles.taskHeader}>
                    <span className={styles.taskName}>{task.name}</span>
                    <Tag color={getTaskStatusColor(task.status)} style={{ fontSize: "12px" }}>
                      {task.status}
                    </Tag>
                  </div>
                  <div className={styles.taskProgress}>
                    <ProgressBar
                      percent={task.progress}
                      style={{
                        "--fill-color": task.progress === 100 ? "#52c41a" : "#1890ff",
                      }}
                    />
                    <span className={styles.progressText}>{task.progress}%</span>
                  </div>
                </div>
              ))}
            </Space>
          </Card>
        </div>
      </Access>

      {/* 最近活动 */}
      <Access accessible={access.isAdmin}>
        <div className={styles.activitySection}>
          <Card
            title="最近活动"
            extra={
              <Button size="small" fill="none" onClick={() => navigate("/admin/logs")}>
                查看更多
              </Button>
            }
            className={styles.sectionCard}
          >
            <Space direction="vertical" style={{ width: "100%" }}>
              {recentActivities.map((activity) => (
                <div key={activity.id} className={styles.activityItem}>
                  <div
                    className={styles.activityDot}
                    style={{ backgroundColor: getActivityTypeColor(activity.type) }}
                  />
                  <div className={styles.activityContent}>
                    <div className={styles.activityText}>
                      <strong>{activity.user}</strong> {activity.action}
                    </div>
                    <div className={styles.activityTime}>{activity.time}</div>
                  </div>
                </div>
              ))}
            </Space>
          </Card>
        </div>
      </Access>
    </Space>
  )
}

export default Home
