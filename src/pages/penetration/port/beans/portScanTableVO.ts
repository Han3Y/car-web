// 端口扫描列表数据
export type PortScanTableVO = {
  host: string; // 地址
  port: string; // 端口
  htmlTitle?: string; // HTML Title
  fingerprint?: string; // 指纹
  timestamp: number; // 扫描时间,时间戳形式
  isOpen: boolean; // 是否开启
}
