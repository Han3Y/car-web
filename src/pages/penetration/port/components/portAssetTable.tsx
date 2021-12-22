import {PortAsset} from "@/pages/penetration/port/beans/portAsset";
import React, {useRef, useState} from "react";
import ProTable, {ActionType} from "@ant-design/pro-table";
import {Button, Col, Descriptions, Form, Modal, Popover, Row, Space, Tag} from "antd";
import {ReloadOutlined, SearchOutlined} from "@ant-design/icons/lib";
import {CopyableField, InputItem} from "@/utils/inputUtils";
import {formatTimestamp} from "@/utils/timeUtil";
import {YakEditor} from "@/utils/editors";
import PortScanService from "@/pages/penetration/port/service";


/**
 * 删除端口
 */
export interface PortDeleteFormProp {
  onFinished: () => any
}

interface DeletePortRequest {
  Hosts: string
  Ports: string
}

export const PortDeleteForm: React.FC<PortDeleteFormProp> = (props) => {
  const [params, setParams] = useState<DeletePortRequest>({
    Hosts: "", Ports: "",
  });

  return <Form onClickCapture={e => {
    e.preventDefault()
    // todo 删除
    console.log(params);
  }} layout={"vertical"} size={"small"}>
    <InputItem label={"想要删除的网段/IP"} setValue={Hosts => setParams({...params, Hosts})} value={params.Hosts}/>
    <InputItem label={"想要删除的端口段"} setValue={Ports => setParams({...params, Ports})} value={params.Ports}/>
    <Form.Item>
      <Button type="primary" htmlType="submit" danger={true}> 删除指定内容 </Button>
      <Button type="dashed" danger={true} onClick={() => {
        Modal.confirm({
          title: "确定要删除全部吗？不可恢复", onOk: () => {
            // todo 全部删除
          }
        })
      }}> 删除全部 </Button>
    </Form.Item>
  </Form>
};

/**
 * 端口描述
 */
export interface PortAssetDescriptionProp {
  port: PortAsset
}

export const PortAssetDescription: React.FC<PortAssetDescriptionProp> = (props) => {
  const {port} = props;
  return <Descriptions  size={"small"} bordered={true} column={!port.ServiceType?1:2} title={''} style={{marginLeft:20}}>
    <Descriptions.Item label={<Tag>状态</Tag>}><CopyableField
      text={`${port.State}`}/>
    </Descriptions.Item>
    {port.HtmlTitle && <Descriptions.Item label={<Tag>Title</Tag>}><CopyableField
      text={`${port.HtmlTitle}`}/></Descriptions.Item>}
    {port.ServiceType && <Descriptions.Item span={2} label={<Tag>应用</Tag>}><CopyableField
      text={`${port.ServiceType}`}/></Descriptions.Item>}
    {port.Reason && <Descriptions.Item span={2} label={<Tag>失败原因</Tag>}><CopyableField
      text={`${port.Reason}`}/></Descriptions.Item>}
    {port.CPE.join("|") !== "" ? <Descriptions.Item span={2} label={<Tag>CPE</Tag>}>
      <Space direction={"vertical"}>
        {port.CPE.map( (e,idx) => {
          return <CopyableField
            key={idx}
            text={`${e}`}
          />
        })}
      </Space>
    </Descriptions.Item> : undefined}
    {port.Fingerprint && <Descriptions.Item span={2} label={<Tag>指纹信息</Tag>}>
      <div style={{height: 200}}>
        <YakEditor value={port.Fingerprint} noLineNumber={true} noMiniMap={true}/>
      </div>
    </Descriptions.Item>}
  </Descriptions>
};


export interface PortAssetTableProp {
  closed?: boolean
  onClicked?: (i: PortAsset) => any,
}

/**
 * 关闭端口的列
 */
const closedColumns = [
  {
    title: "网络地址",
    render: (i: PortAsset) => <CopyableField text={`${i.Host}:${i.Port}`}/>,
  },
  {
    title: "端口", width: 70,
    render: (i: PortAsset) => <Tag color={"geekblue"}>{i.Port}</Tag>,
  },
  {
    title: "关闭原因",
    render: (i: PortAsset) => i.ServiceType ? <div style={{width: 230, overflow: "auto"}}><CopyableField
      text={i.Reason}/></div> : "", width: 250,
    search: false,
  },
];

/**
 * 开放端口的列
 */
const openColumns = [
  {
    title: "网络地址",
    render: (i: PortAsset) => <CopyableField text={`${i.Host}:${i.Port}`}/>,
  },
  {
    title: "端口", width: 70,
    render: (i: PortAsset) => <Tag color={"geekblue"}>{i.Port}</Tag>,
  },
  {
    title: "协议", width: 57,
    render: (i: PortAsset) => <Tag color={"green"}>{i.Proto}</Tag>,
    search: false,
  },
  {
    title: "服务指纹",
    render: (i: PortAsset) => i.ServiceType ? <div style={{width: 230,overflowX: 'hidden'}}><CopyableField
      text={i.ServiceType}/></div> : "", width: 250,
  },
  {
    title: "Title",
    render: (i: PortAsset) => i.ServiceType ? <div style={{width: 150, overflow: "auto"}}><CopyableField
      text={i.HtmlTitle}/></div> : "", width: 170,
  },
  {title: "最近更新时间",
    render: (i: PortAsset) => <Tag color={"green"}>{formatTimestamp(i.UpdatedAt)}</Tag>,
    search: false
  },
  {
    title: "操作", render: (i: PortAsset) => <Button
      size={"small"} type={"link"}
      onClick={e => {
        window.open(`http://${i.Host}:${i.Port}`, '_blank')
      }}>打开</Button>, fixed: "right",
    search: false
  },
];

export const PortAssetTable: React.FC<PortAssetTableProp> = (props) => {

  // table实例
  const actionRef = useRef<ActionType>();

  return (
    <ProTable<PortAsset, API.PageParams>
      rowKey="Id"
      actionRef={actionRef}
      options={false}
      bordered={true}
      toolBarRender={false}
      request={PortScanService.listByPage}
      columns={closed ? closedColumns: openColumns}
      expandable={{
        expandedRowRender: record => <PortAssetDescription port={record}/>,
      }}
      title={() => {
        return <Row>
          <Col span={12}>
            <Space>
              {closed ? '未开放端口' :'开放端口'}
              {/*<Button*/}
              {/*  icon={<ReloadOutlined/>} size={"small"} type={"link"}*/}
              {/*  onClick={() => {*/}
              {/*    actionRef.current?.reloadAndRest?.();*/}
              {/*  }}*/}
              {/*/>*/}
            </Space>
          </Col>
          <Col span={12} style={{textAlign: "right"}}>
            <Popover
              title={"选择性删除端口"}
              content={<PortDeleteForm onFinished={() => actionRef.current?.reloadAndRest?.()}/>}
            >
              <Button size={"small"} danger={true}>删除端口</Button>
            </Popover>
          </Col>
        </Row>
      }}
    />
  )
}

