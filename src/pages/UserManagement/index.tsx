import React, { useMemo, useState } from "react"

import {
  ActionSheet,
  Avatar,
  Badge,
  Button,
  Card,
  Dialog,
  Divider,
  List,
  SearchBar,
  Space,
  Switch,
  Tag,
  Toast,
} from "antd-mobile"
import {
  AddOutline,
  ClockCircleOutline,
  MailOutline,
  MoreOutline,
  PhonebookOutline,
  TeamOutline,
  UserOutline,
} from "antd-mobile-icons"

import { Access, useAccess } from "@/access"

import styles from "./index.module.less"

// 用户数据类型
interface User {
  id: string
  username: string
  email: string
  phone: string
  roles: string[]
  status: "active" | "disabled"
  avatar?: string
  createTime: string
  lastLogin?: string
  department: string
}

// 模拟用户数据
const mockUsers: User[] = [
  {
    id: "1",
    username: "admin",
    email: "admin@example.com",
    phone: "13800138000",
    roles: ["admin"],
    status: "active",
    avatar: "https://picsum.photos/40/40?random=1",
    createTime: "2024-01-01",
    lastLogin: "2024-01-15 10:30",
    department: "系统管理部",
  },
  {
    id: "2",
    username: "张三",
    email: "zhangsan@example.com",
    phone: "13800138001",
    roles: ["user"],
    status: "active",
    avatar: "https://picsum.photos/40/40?random=2",
    createTime: "2024-01-05",
    lastLogin: "2024-01-15 09:15",
    department: "技术部",
  },
  {
    id: "3",
    username: "李四",
    email: "lisi@example.com",
    phone: "13800138002",
    roles: ["user", "editor"],
    status: "disabled",
    avatar: "https://picsum.photos/40/40?random=3",
    createTime: "2024-01-10",
    lastLogin: "2024-01-12 16:45",
    department: "产品部",
  },
  {
    id: "4",
    username: "王五",
    email: "wangwu@example.com",
    phone: "13800138003",
    roles: ["user"],
    status: "active",
    createTime: "2024-01-12",
    department: "市场部",
  },
  {
    id: "5",
    username: "赵六",
    email: "zhaoliu@example.com",
    phone: "13800138004",
    roles: ["user", "reviewer"],
    status: "active",
    avatar: "https://picsum.photos/40/40?random=5",
    createTime: "2024-01-13",
    lastLogin: "2024-01-14 14:20",
    department: "运营部",
  },
]

const UserManagement: React.FC = () => {
  const access = useAccess()
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [searchValue, setSearchValue] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "disabled">("all")
  const [actionSheetVisible, setActionSheetVisible] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  // 过滤用户
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchSearch =
        user.username.toLowerCase().includes(searchValue.toLowerCase()) ||
        user.email.toLowerCase().includes(searchValue.toLowerCase()) ||
        user.phone.includes(searchValue) ||
        user.department.includes(searchValue)

      const matchStatus = filterStatus === "all" || user.status === filterStatus

      return matchSearch && matchStatus
    })
  }, [users, searchValue, filterStatus])

  // 统计数据
  const stats = useMemo(
    () => ({
      total: users.length,
      active: users.filter((u) => u.status === "active").length,
      disabled: users.filter((u) => u.status === "disabled").length,
      admins: users.filter((u) => u.roles.includes("admin")).length,
    }),
    [users]
  )

  // 获取角色显示名
  const getRoleLabel = (role: string) => {
    const roleMap: Record<string, string> = {
      admin: "管理员",
      user: "普通用户",
      editor: "编辑者",
      reviewer: "审核员",
    }
    return roleMap[role] || role
  }

  // 获取角色颜色
  const getRoleColor = (role: string) => {
    const colorMap: Record<string, string> = {
      admin: "danger",
      user: "primary",
      editor: "warning",
      reviewer: "success",
    }
    return colorMap[role] || "default"
  }

  // 获取状态颜色
  const getStatusColor = (status: string) => {
    return status === "active" ? "success" : "danger"
  }

  // 切换用户状态
  const handleToggleStatus = (user: User) => {
    const newStatus: "active" | "disabled" = user.status === "active" ? "disabled" : "active"
    const updatedUsers = users.map((u) => (u.id === user.id ? { ...u, status: newStatus } : u))
    setUsers(updatedUsers)
    Toast.show(`用户已${newStatus === "active" ? "启用" : "禁用"}`)
  }

  // 删除用户
  const handleDeleteUser = (user: User) => {
    Dialog.confirm({
      content: `确定要删除用户 "${user.username}" 吗？`,
      onConfirm: () => {
        const updatedUsers = users.filter((u) => u.id !== user.id)
        setUsers(updatedUsers)
        Toast.show("用户删除成功")
      },
    })
  }

  // 显示用户操作菜单
  const showUserActions = (user: User) => {
    setSelectedUser(user)
    setActionSheetVisible(true)
  }

  const actionSheetActions = [
    {
      text: "编辑用户",
      key: "edit",
      onClick: () => {
        Toast.show("编辑用户功能敬请期待")
        setActionSheetVisible(false)
      },
    },
    {
      text: selectedUser?.status === "active" ? "禁用用户" : "启用用户",
      key: "toggle",
      onClick: () => {
        if (selectedUser) {
          handleToggleStatus(selectedUser)
        }
        setActionSheetVisible(false)
      },
    },
    ...(access.hasPermission("user:delete:*")
      ? [
          {
            text: "删除用户",
            key: "delete",
            danger: true,
            onClick: () => {
              if (selectedUser) {
                handleDeleteUser(selectedUser)
              }
              setActionSheetVisible(false)
            },
          },
        ]
      : []),
  ]

  return (
    <div className={styles.container}>
      {/* 页面标题 */}
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>用户管理</h1>
        <Access accessible={access.hasPermission("user:create:*")}>
          <Button
            color="primary"
            size="middle"
            onClick={() => {
              Toast.show("添加用户功能敬请期待")
            }}
          >
            <AddOutline /> 添加用户
          </Button>
        </Access>
      </div>

      {/* 统计卡片 */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div
            className={styles.statIcon}
            style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}
          >
            <UserOutline />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.total}</div>
            <div className={styles.statLabel}>总用户数</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div
            className={styles.statIcon}
            style={{ background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" }}
          >
            <TeamOutline />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.active}</div>
            <div className={styles.statLabel}>活跃用户</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div
            className={styles.statIcon}
            style={{ background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" }}
          >
            <ClockCircleOutline />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.disabled}</div>
            <div className={styles.statLabel}>禁用用户</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div
            className={styles.statIcon}
            style={{ background: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)" }}
          >
            <TeamOutline />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.admins}</div>
            <div className={styles.statLabel}>管理员</div>
          </div>
        </div>
      </div>

      {/* 搜索和筛选 */}
      <Card className={styles.filterCard}>
        <div className={styles.searchSection}>
          <SearchBar
            placeholder="搜索用户名、邮箱、手机号或部门"
            value={searchValue}
            onChange={setSearchValue}
            style={{ flex: 1 }}
          />
        </div>

        <Divider style={{ margin: "12px 0" }} />

        <div className={styles.filterSection}>
          <Space wrap>
            <Button
              size="small"
              fill={filterStatus === "all" ? "solid" : "outline"}
              color={filterStatus === "all" ? "primary" : "default"}
              onClick={() => setFilterStatus("all")}
            >
              全部用户
            </Button>
            <Button
              size="small"
              fill={filterStatus === "active" ? "solid" : "outline"}
              color={filterStatus === "active" ? "success" : "default"}
              onClick={() => setFilterStatus("active")}
            >
              活跃用户
            </Button>
            <Button
              size="small"
              fill={filterStatus === "disabled" ? "solid" : "outline"}
              color={filterStatus === "disabled" ? "danger" : "default"}
              onClick={() => setFilterStatus("disabled")}
            >
              禁用用户
            </Button>
          </Space>
        </div>
      </Card>

      {/* 用户列表 */}
      <Card className={styles.userListCard}>
        <div className={styles.userListHeader}>
          <span className={styles.userListTitle}>用户列表</span>
          <Badge content={filteredUsers.length} style={{ "--right": "-8px", "--top": "-8px" }} />
        </div>

        {filteredUsers.length === 0 ? (
          <div className={styles.emptyState}>
            <UserOutline className={styles.emptyIcon} />
            <div className={styles.emptyText}>暂无用户数据</div>
            <div className={styles.emptySubText}>
              {searchValue ? "没有找到匹配的用户" : "还没有任何用户"}
            </div>
          </div>
        ) : (
          <List className={styles.userList}>
            {filteredUsers.map((user, index) => (
              <List.Item
                key={user.id}
                className={`${styles.userItem} ${index === filteredUsers.length - 1 ? styles.lastItem : ""}`}
              >
                <div className={styles.userCard}>
                  <div className={styles.userAvatar}>
                    <Avatar
                      src={user.avatar || ""}
                      style={{ borderRadius: "50%", width: "48px", height: "48px" }}
                      fallback={user.username.charAt(0).toUpperCase()}
                    />
                    <Badge
                      content=""
                      color={getStatusColor(user.status)}
                      style={{
                        position: "absolute",
                        right: "2px",
                        top: "2px",
                        width: "12px",
                        height: "12px",
                      }}
                    />
                  </div>

                  <div className={styles.userInfo}>
                    <div className={styles.userHeader}>
                      <span className={styles.userName}>{user.username}</span>
                      <div className={styles.userRoles}>
                        {user.roles.map((role) => (
                          <Tag
                            key={role}
                            color={getRoleColor(role)}
                            style={{ fontSize: "10px", padding: "2px 6px" }}
                          >
                            {getRoleLabel(role)}
                          </Tag>
                        ))}
                      </div>
                    </div>

                    <div className={styles.userMeta}>
                      <div className={styles.metaItem}>
                        <MailOutline className={styles.metaIcon} />
                        <span className={styles.metaText}>{user.email}</span>
                      </div>
                      <div className={styles.metaItem}>
                        <PhonebookOutline className={styles.metaIcon} />
                        <span className={styles.metaText}>{user.phone}</span>
                      </div>
                      <div className={styles.metaItem}>
                        <TeamOutline className={styles.metaIcon} />
                        <span className={styles.metaText}>{user.department}</span>
                      </div>
                    </div>

                    <div className={styles.userDates}>
                      <span className={styles.dateItem}>创建时间: {user.createTime}</span>
                      {user.lastLogin && (
                        <span className={styles.dateItem}>最后登录: {user.lastLogin}</span>
                      )}
                    </div>
                  </div>

                  <div className={styles.userActions}>
                    <Access accessible={access.hasPermission("user:update:*")}>
                      <Switch
                        style={{ "--width": "42px", "--height": "24px" }}
                        checked={user.status === "active"}
                        onChange={() => handleToggleStatus(user)}
                      />
                    </Access>
                    <Button
                      size="small"
                      fill="none"
                      color="primary"
                      onClick={() => showUserActions(user)}
                    >
                      <MoreOutline />
                    </Button>
                  </div>
                </div>
              </List.Item>
            ))}
          </List>
        )}
      </Card>

      {/* 用户操作菜单 */}
      <ActionSheet
        visible={actionSheetVisible}
        actions={actionSheetActions}
        onClose={() => setActionSheetVisible(false)}
        cancelText="取消"
      />
    </div>
  )
}

export default UserManagement
