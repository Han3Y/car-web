/**
 * 列表分页请求响应具体数据格式
 */
export type ListPageVO<T> = {
  items: T[],
  total: number
}
