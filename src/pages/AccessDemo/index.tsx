import React from "react"

import { Button, Card, Space, Toast } from "antd-mobile"

import { Access, useAccess } from "@/access"

import styles from "./index.module.less"

const AccessDemo: React.FC = () => {
  const access = useAccess()

  const handleAdminAction = () => {
    Toast.show({
      icon: "success",
      content: "管理员操作执行成功！",
    })
  }

  const handleUserAction = () => {
    Toast.show({
      icon: "success",
      content: "用户操作执行成功！",
    })
  }

  const handleUserRead = () => {
    if (access.canRead("user:read:*")) {
      Toast.show({
        icon: "success",
        content: "用户读取操作成功！",
      })
    } else {
      Toast.show({
        icon: "fail",
        content: "您没有用户读取权限",
      })
    }
  }

  const handleUserCreate = () => {
    if (access.canCreate("user:create:*")) {
      Toast.show({
        icon: "success",
        content: "用户创建操作成功！",
      })
    } else {
      Toast.show({
        icon: "fail",
        content: "您没有用户创建权限",
      })
    }
  }

  return (
    <Space className={styles.container} direction="vertical" block>
      {/* 基础权限信息展示 */}
      <Card title="当前用户权限信息">
        <Space direction="vertical">
          <div>登录状态: {access.isAuthenticated ? "已登录" : "未登录"}</div>
          <div>是否管理员: {access.isAdmin ? "是" : "否"}</div>
          <div>是否普通用户: {access.isUser ? "是" : "否"}</div>
        </Space>
      </Card>

      {/* 分层级权限演示 */}
      <Card title="分层级权限控制 (资源:操作:范围)">
        <Space direction="vertical" style={{ width: "100%" }}>
          {/* 用户模块权限 */}
          <Card title="用户管理模块权限 (user:*)" style={{ fontSize: "14px" }}>
            <Space direction="vertical" style={{ width: "100%" }}>
              <Access
                accessible={access.canRead("user:read:*")}
                fallback={<div style={{ color: "red" }}>❌ 无用户读取权限 (user:read)</div>}
              >
                <div style={{ color: "green" }}>✅ 有用户读取权限 (user:read)</div>
              </Access>

              <Access
                accessible={access.canCreate("user:create:*")}
                fallback={<div style={{ color: "red" }}>❌ 无用户创建权限 (user:create)</div>}
              >
                <div style={{ color: "green" }}>✅ 有用户创建权限 (user:create)</div>
              </Access>

              <Access
                accessible={access.canUpdate("user:update:*")}
                fallback={<div style={{ color: "red" }}>❌ 无用户更新权限 (user:update)</div>}
              >
                <div style={{ color: "green" }}>✅ 有用户更新权限 (user:update)</div>
              </Access>

              <Access
                accessible={access.canDelete("user:delete:*")}
                fallback={<div style={{ color: "red" }}>❌ 无用户删除权限 (user:delete)</div>}
              >
                <div style={{ color: "green" }}>✅ 有用户删除权限 (user:delete)</div>
              </Access>
            </Space>
          </Card>
        </Space>
      </Card>

      {/* 操作权限演示 */}
      <Card title="权限控制操作演示">
        <Space direction="vertical" style={{ width: "100%" }}>
          <Access
            accessible={access.isAdmin}
            fallback={
              <Button disabled color="danger">
                管理员操作（无权限）
              </Button>
            }
          >
            <Button color="danger" onClick={handleAdminAction}>
              管理员操作
            </Button>
          </Access>

          <Access
            accessible={access.isAuthenticated}
            fallback={<Button disabled>用户操作（需要登录）</Button>}
          >
            <Button color="primary" onClick={handleUserAction}>
              用户操作
            </Button>
          </Access>

          <Button onClick={handleUserRead}>读取用户信息 (检查 user:read 权限)</Button>

          <Button onClick={handleUserCreate}>创建用户 (检查 user:create 权限)</Button>
        </Space>
      </Card>

      {/* 通配符权限演示 */}
      <Card title="通配符权限演示">
        <Space direction="vertical">
          <div>
            <strong>权限匹配规则：</strong>
          </div>

          <div style={{ fontSize: "12px", color: "#666" }}>• *:*:* = 超级管理员权限 (所有权限)</div>
          <div style={{ fontSize: "12px", color: "#666" }}>• user:*:* = 用户模块所有权限</div>
          <div style={{ fontSize: "12px", color: "#666" }}>• *:read:* = 所有模块的读取权限</div>
          <div style={{ fontSize: "12px", color: "#666" }}>
            • user:read:own = 只能读取自己的用户信息
          </div>

          <Access
            accessible={access.hasPermission("*:*:*")}
            fallback={<div style={{ color: "orange" }}>您不是超级管理员 (*:*:*)</div>}
          >
            <div style={{ color: "green" }}>✅ 您是超级管理员 (*:*:*)</div>
          </Access>

          <Access
            accessible={access.hasAnyPermission(["user:read:*", "user:create:*"])}
            fallback={<div style={{ color: "orange" }}>您没有用户相关权限</div>}
          >
            <div style={{ color: "green" }}>✅ 您有用户相关权限</div>
          </Access>

          <Access
            accessible={access.hasAnyRole(["admin", "moderator"])}
            fallback={<div style={{ color: "orange" }}>您不是管理员或版主</div>}
          >
            <div style={{ color: "green" }}>✅ 您是管理员或版主</div>
          </Access>
        </Space>
      </Card>

      {/* 路由权限对应 */}
      <Card title="路由权限对应">
        <Space direction="vertical">
          <div style={{ fontSize: "14px", fontWeight: "bold" }}>当前路由配置的权限要求：</div>

          <div style={{ fontSize: "12px" }}>
            <strong>/admin/users</strong> - 需要 user:read:* 权限
            <br />
            状态:{" "}
            {access.hasPermission("user:read:*") ? (
              <span style={{ color: "green" }}>✅ 可访问</span>
            ) : (
              <span style={{ color: "red" }}>❌ 无权限</span>
            )}
          </div>
        </Space>
      </Card>

      {/* 权限检查函数演示 */}
      <Card title="权限检查函数">
        <Space direction="vertical">
          <div>hasRole("admin"): {access.hasRole("admin") ? "✅" : "❌"}</div>
          <div>
            hasPermission("user:read:*"): {access.hasPermission("user:read:*") ? "✅" : "❌"}
          </div>
          <div>
            hasAnyRole(["admin", "user"]): {access.hasAnyRole(["admin", "user"]) ? "✅" : "❌"}
          </div>
          <div>
            hasAnyPermission(["user:read:*", "post:read:*"]):{" "}
            {access.hasAnyPermission(["user:read:*", "post:read:*"]) ? "✅" : "❌"}
          </div>
          <div>canRead("user:read"): {access.canRead("user:read:*") ? "✅" : "❌"}</div>
          <div>canCreate("post:create"): {access.canCreate("post:create:*") ? "✅" : "❌"}</div>
          <div>canUpdate("user:update"): {access.canUpdate("user:update:*") ? "✅" : "❌"}</div>
          <div>canDelete("user:delete"): {access.canDelete("user:delete:*") ? "✅" : "❌"}</div>
        </Space>
      </Card>
    </Space>
  )
}

export default AccessDemo
