/**
 * antd分页列表需要的数据格式
 */
export type TablePageVO<T> = {
  data: T[], // 列表数据
  success: boolean; // 响应是否成功
  total: number; // 总数
}
