// i宜宾 类型声明
declare module "ryt-jssdk" {
  interface RytSDK {
    isRyt(): boolean
    [key: string]: any
  }
  export const ryt: RytSDK
}
