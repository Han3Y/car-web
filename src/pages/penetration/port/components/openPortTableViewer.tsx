import {PortScanTableVO} from "@/pages/penetration/port/beans/portScanTableVO";
import {Table, Tag} from "antd";
import React from "react";
import {CopyableField} from "@/utils/inputUtils";
import {formatTimestamp} from "@/utils/timeUtil";

export interface PortTableProp {
  data: PortScanTableVO[]
}

/**
 * 开放端口表格
 * @param props
 * @constructor
 */
export const OpenPortTableViewer: React.FC<PortTableProp> = (props) => {
  return <Table<PortScanTableVO>
    size={"small"} bordered={true}
    rowKey={(row)=>row.host}
    title={e => {
      return <>开放端口 / Open Ports</>
    }}
    dataSource={props.data}
    scroll={{x: "auto"}}
    columns={[
      {title: "主机地址", render: (i: PortScanTableVO) => <CopyableField text={`${i.host}:${i.port}`}/>, fixed: "left",},
      {
        title: "HTML Title",
        render: (i: PortScanTableVO) => i.htmlTitle ? <div style={{width: 150, overflow: "auto"}}>
          <CopyableField
            text={i.htmlTitle}
          />
        </div> : "-",
        width: 150,
      },
      {
        title: "指纹", render: (i: PortScanTableVO) => i.fingerprint ? <div style={{width: 200, overflowX: 'hidden'}}>
          <CopyableField
            text={i.fingerprint}
          />
        </div> : "-", width: 230,
      },
      {title: "扫描时间", render: (i: PortScanTableVO) => <Tag>{formatTimestamp(i.timestamp)}</Tag>},
    ]}
    pagination={{
      size: "small", pageSize: 12, pageSizeOptions: ["12", "15", "30", "50"],
      showSizeChanger: true,
    }}
  >

  </Table>
};

/**
 * 未开放端口表格
 * @param props
 * @constructor
 */
export const ClosedPortTableViewer: React.FC<PortTableProp> = (props) => {
  return <Table<PortScanTableVO>
    size={"small"} bordered={true}
    title={e => {
      return <>未开放的端口 / Closed Ports</>
    }}
    dataSource={props.data}
    columns={[
      {title: "主机地址", render: (i: PortScanTableVO) => <CopyableField text={`${i.host}:${i.port}`}/>},
      {title: "扫描时间", render: (i: PortScanTableVO) => <Tag>{formatTimestamp(i.timestamp)}</Tag>},
    ]}
    pagination={{
      size: "small", pageSize: 12, pageSizeOptions: ["12", "15", "30", "50"],
      showSizeChanger: true,
    }}
  >

  </Table>
};
