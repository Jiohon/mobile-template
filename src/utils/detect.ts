import { ryt } from "ryt-jssdk"

/**
 * @description 检测当前运行环境
 * @returns {string} 返回当前环境类型: 'browser', 'iframe', 'miniProgram', 'app'
 */
export let detectEnvironment = () => {
  // 检测是否在小程序环境中
  const isMiniProgram = () => {
    return (
      // 检查是否存在微信小程序环境
      typeof window !== "undefined" &&
      window.navigator &&
      window.navigator.userAgent &&
      window.navigator.userAgent.toLowerCase().indexOf("miniprogram") > -1
    )
  }

  // 使用「i宜宾SDK」检测是否在App内嵌H5环境中
  // https://iyb-cityapp1.sjdit.com/ryt-docs/jsapi/openApi.html#isRyt
  const isApp = () => {
    return typeof ryt !== "undefined" && ryt.isRyt()
  }

  // 检测是否在iframe中
  const isIframe = () => {
    try {
      return window.self !== window.top
    } catch (e) {
      // 如果不能访问父窗口，很可能是因为跨域限制，说明当前页面在iframe中
      return true
    }
  }

  // 优先级判断：小程序 > App > iframe > 普通浏览器
  if (isMiniProgram()) {
    detectEnvironment = () => "miniProgram"
    return "miniProgram"
  } else if (isApp()) {
    detectEnvironment = () => "app"
    return "app"
  } else if (isIframe()) {
    detectEnvironment = () => "iframe"
    return "iframe"
  } else {
    detectEnvironment = () => "browser"
    return "browser"
  }
}

/**
 * @description 检测设备操作系统类型
 * @returns {string} 返回当前设备操作系统类型: 'ios', 'android', 'windows', 'mac', 'linux', 'other'
 */
export const detectDeviceOS = () => {
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera || ""

  // iOS 检测
  if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) {
    return "ios"
  }

  // Android 检测
  if (/android/i.test(userAgent)) {
    return "android"
  }

  // Windows 检测
  if (/Win/.test(navigator.platform)) {
    return "windows"
  }

  // Mac 检测
  if (/Mac/.test(navigator.platform)) {
    return "mac"
  }

  // Linux 检测
  if (/Linux/.test(navigator.platform)) {
    return "linux"
  }

  // 其他平台
  return "other"
}
