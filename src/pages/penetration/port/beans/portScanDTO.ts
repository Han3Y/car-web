// 启动端口扫描
export type PortScanDTO = {
  Mode: string; // 扫描模式 syn:SYN/fingerprint:指纹/all:SYN+指纹
  Targets: string; // 扫描目标，域名/主机/IP/IP段均可，逗号分隔或按行分割
  Ports: string; // 预设端口，逗号分隔，如：7,5555,9,13,21
  Concurrent: number; // 并发数，最多同时扫描多少个端口
  Active: boolean; // 主动模式
  SaveToDB: boolean; // 扫描结果入库，
  SaveClosedPorts: boolean; // 保存关闭的接口
  FingerprintMode: string; // 高级指纹选项，模式为 指纹 或  SYN+指纹 的时候传，web：仅web指纹 / service: 仅nmap指纹 / all: 全部指纹
}
