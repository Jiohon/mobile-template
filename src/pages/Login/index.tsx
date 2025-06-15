import { useState } from "react"

import { Button, Card, Form, Input, Toast } from "antd-mobile"
import { EyeInvisibleOutline, EyeOutline } from "antd-mobile-icons"
import { Navigate, useLocation } from "react-router"

import { useAuthStore } from "@/stores/auth"

import styles from "./index.module.less"

const Login: React.FC = () => {
  const location = useLocation()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false)
  const { isAuthenticated, login } = useAuthStore()

  // 获取来源路径，如果没有则默认跳转到首页
  const from = (location.state as any)?.from || "/profile"

  // 如果已登录，直接重定向
  if (isAuthenticated) {
    return <Navigate to={from} replace />
  }

  const onFinish = async (values: any) => {
    setLoading(true)
    try {
      await login(values)

      Toast.show({
        icon: "success",
        content: "登录成功",
      })
    } catch (error) {
      console.error("❌ [Login] 登录失败:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>欢迎登录</h1>
        <p className={styles.subtitle}>请输入您的账号和密码</p>
        <p style={{ color: "rgba(50, 50, 50, 0.6)", fontSize: "12px", marginTop: "8px" }}>
          登录后将跳转到: {from}
        </p>
      </div>

      <Card>
        <Form
          layout="horizontal"
          form={form}
          onFinish={onFinish}
          initialValues={{
            username: "admin",
            password: "123456",
          }}
          footer={
            <Button block type="submit" color="primary" size="large" loading={loading}>
              登录
            </Button>
          }
          className={styles.form}
        >
          <Form.Item
            name="username"
            label="用户名"
            rules={[{ required: true, message: "请输入用户名" }]}
          >
            <Input placeholder="请输入用户名" clearable />
          </Form.Item>

          <Form.Item
            name="password"
            label="密码"
            rules={[{ required: true, message: "请输入密码" }]}
            extra={
              <div onClick={() => setVisible(!visible)}>
                {visible ? <EyeOutline /> : <EyeInvisibleOutline />}
              </div>
            }
          >
            <Input placeholder="请输入密码" clearable type={visible ? "text" : "password"} />
          </Form.Item>
        </Form>
      </Card>

      <div className={styles.demo}>
        <p>演示账号：</p>
        <p>用户名：admin</p>
        <p>密码：123456</p>
        <p>演示账号：</p>
        <p>用户名：user</p>
        <p>密码：123456</p>
      </div>
    </div>
  )
}

export default Login
