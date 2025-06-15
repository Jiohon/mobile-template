const LAZY_TYPE = Symbol.for("react.lazy")

/**
 * 判断是否是懒加载组件
 * @param component 组件
 * @returns 是否是懒加载组件
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isLazyComponent = (component: any): boolean => {
  return typeof component === "object" && component !== null && component.$$typeof === LAZY_TYPE
}
