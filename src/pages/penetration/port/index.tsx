import React, {useEffect, useRef, useState} from "react";
import {Button, Col, Divider, Row, Spin, Switch, Tabs, Tag} from "antd";
import styles from './index.less';
import ProForm, {
  ProFormInstance,
  ProFormRadio,
  ProFormSelect, ProFormSlider, ProFormSwitch,
  ProFormText,
  ProFormTextArea
} from "@ant-design/pro-form";
import {LAYOUT_VERTICAL} from "../../../../config/uiConfig";
import {PortScanDTO} from "@/pages/penetration/port/beans/portScanDTO";
import {PresetPorts} from "@/pages/penetration/port/schema";
import {PortScanTableVO} from "@/pages/penetration/port/beans/portScanTableVO";
import {writeXTerm, xtermClear, xtermFit} from "@/utils/xtermUtils";
import {ClosedPortTableViewer, OpenPortTableViewer} from "@/pages/penetration/port/components/openPortTableViewer";
import {XTerm} from "xterm-for-react";
import {VALIDATOR_MSG} from "../../../../config/validate";
import {PortAssetTable} from "@/pages/penetration/port/components/portAssetTable";

const PortScanPage: React.FC<any> = () => {
  const [loading, setLoading] = useState<boolean>(false); // 是否正在提交
  const [initValue] = useState<Partial<PortScanDTO>>({
    Mode: 'syn',
    Ports: '22,443,445,80,8000-8004,3306,3389,5432,8080-8084,7000-7005',
    Concurrent: 50,
    Active: true,
    SaveToDB: true,
    SaveClosedPorts: false,
    FingerprintMode: 'web'
  });
  const [Concurrent, setConcurrent] = useState<number>(initValue.Concurrent || 1); // 最大并发数
  const [advanced, setAdvanced] = useState<boolean>(false); // 是否选中“高级选项”
  const [mode, setMode] = useState<string>('syn'); // 扫描模式
  const [resettingData, setResettingData] = useState<boolean>(false); // 是否正在清空数据
  const [resetTrigger, setResetTrigger] = useState<boolean>(false); // 触发xterm更新
  const [openPorts, setOpenPorts] = useState<PortScanTableVO[]>([]); // 开放端口
  const [closedPorts, setClosedPorts] = useState<PortScanTableVO[]>([]); // 关闭端口
  const formRef = useRef<ProFormInstance>();
  const xtermRef = useRef(null); // xterm实例

  // 打开websocket监听，并定数刷新表格数据
  useEffect(() => {
    // todo 建立长链接
    const openPortsList: PortScanTableVO[] = []; // 开放端口
    const closedPortsList: PortScanTableVO[] = []; // 关闭端口
    const syncPorts = () => {
      if (openPortsList) setOpenPorts([...openPortsList]);
      if (closedPortsList) setClosedPorts([...closedPortsList]);
    }
    const id = setInterval(syncPorts, 1000)
    // todo 关闭长链接
    return () => {
      clearInterval(id);
    }
  }, []);

  // 清空缓存数据
  useEffect(() => {
    if (!xtermRef) {
      return;
    }
    setOpenPorts([]);
    setClosedPorts([]);
  }, [xtermRef, resetTrigger]);

  // 调整命令行大小
  useEffect(() => {
    if (xtermRef) xtermFit(xtermRef, 72, 10);
  });

  return (
    <div className={styles.container}>
      <Tabs>
        <Tabs.TabPane tab={"扫描端口操作台"} key={"scan"}>
          <Row gutter={12}>
            <Col span={8} md={8} xxl={6}>
              <ProForm<PortScanDTO>
                layout={LAYOUT_VERTICAL}
                formRef={formRef}
                initialValues={initValue}
                submitter={{
                  searchConfig: {
                    submitText: loading ? '立即停止扫描' : '开始端口扫描'
                  },
                  render: (_, dom) => dom.pop(),
                  submitButtonProps: {
                    size: 'large',
                    style: {
                      width: '100%',
                    },
                    className: loading ? styles.stop_btn: ''
                  },
                }}
                onFinish={async (values: PortScanDTO) => {
                  console.log(values);
                  writeXTerm(xtermRef, 'abc\n');
                  if(loading){
                    setLoading(false);
                  }else{
                    setLoading(true);
                  }
                }}
              >
                <Spin spinning={loading}>
                  <ProFormRadio.Group
                    name="Mode"
                    label="扫描模式"
                    radioType="button"
                    fieldProps={{
                      buttonStyle: "solid",
                      onChange: (e) => {
                        setMode(e.target.value);
                      }
                    }}
                    options={[
                      {
                        label: 'SYN',
                        value: 'syn',
                      },
                      {
                        label: '指纹',
                        value: 'fingerprint',
                      },
                      {
                        label: 'SYN+指纹',
                        value: 'all',
                      },
                    ]}
                  />
                  <ProFormTextArea
                    name='Targets'
                    label='扫描目标'
                    fieldProps={{
                      autoSize: {
                        maxRows: 5,
                        minRows: 5
                      }
                    }}
                    rules={[
                      {
                        required: true,
                        message: VALIDATOR_MSG.required
                      }
                    ]}
                    help='域名/主机/IP/IP段均可，逗号分隔或按行分割'
                  />
                  <ProFormSelect
                    label='扫描端口 （服务端去重）'
                    options={[
                      {
                        label: '常见100端口',
                        value: 'top100'
                      },
                      {
                        label: '常见一两千',
                        value: 'top1000+'
                      }
                    ]}
                    placeholder='选择预设端口'
                    fieldProps={{
                      onChange: (value: string) => {
                        formRef.current?.setFieldsValue({
                          Ports: PresetPorts[value]
                        });
                      }
                    }}
                  />
                  <ProFormTextArea
                    label=''
                    name='Ports'
                    fieldProps={{
                      prefix: '123',
                      autoSize: {
                        maxRows: 5,
                        minRows: 5
                      }
                    }}
                  />
                  <ProFormSlider
                    name="Concurrent"
                    label="并发"
                    width="lg"
                    min={1} max={200}
                    fieldProps={{
                      onChange: setConcurrent
                    }}
                    help={`最多同时扫描${Concurrent}个端口`}
                  />
                  <Divider orientation={"left"}>
                    高级选项 <Switch checked={advanced} onChange={setAdvanced}/>
                  </Divider>
                  {
                    advanced && <>
                      <ProFormSwitch name="Active" label="主动模式"  help={"允许指纹探测主动发包"} />
                      <ProFormSwitch name="SaveToDB" label="扫描结果入库" />
                      <ProFormSwitch name="SaveClosedPorts" label="保存关闭的端口" />
                      {
                        mode !== 'syn' && <>
                          <ProFormRadio.Group
                            name="FingerprintMode"
                            label="高级指纹选项"
                            radioType="button"
                            fieldProps={{
                              buttonStyle: "solid"
                            }}
                            options={[
                              {
                                label: '仅web指纹',
                                value: 'web',
                              },
                              {
                                label: '仅nmap指纹',
                                value: 'service',
                              },
                              {
                                label: '全部指纹',
                                value: 'all',
                              },
                            ]}
                          />
                        </>
                      }
                    </>
                  }
                </Spin>
              </ProForm>
            </Col>
            <Col span={16} md={16} xxl={18}>
              <div>
                <Row>
                  <Col span={24} style={{marginBottom: 8}}>
                    <div style={{
                      textAlign: "right"
                    }}>
                      {loading ? <Tag color={"green"}>正在执行...</Tag> : <Tag>
                        闲置中...
                      </Tag>}
                      <Button
                        disabled={resettingData || loading} size={"small"} onClick={e => {
                          xtermClear(xtermRef);
                          setResettingData(true)
                          setResetTrigger(!resetTrigger)
                          setTimeout(() => {
                            setResettingData(false)
                          }, 1200)
                        }}
                        type={"link"} danger={true}>清空缓存结果</Button>
                    </div>
                  </Col>
                  <Col span={24}>
                    <div style={{width: "100%",overflow: "auto"}}>
                      <XTerm ref={xtermRef}
                             options={{
                        convertEol: true, disableStdin: true,
                      }} onResize={r => xtermFit(xtermRef, r.cols, 10)}/>
                    </div>
                  </Col>
                </Row>
                <Spin spinning={resettingData}>
                  <Row style={{marginTop: 6}} gutter={6}>
                    <Col span={24}>
                      <OpenPortTableViewer data={openPorts}/>
                    </Col>
                    {/*<Col span={24}>*/}
                    {/*    <ClosedPortTableViewer data={closedPorts}/>*/}
                    {/*</Col>*/}
                  </Row>
                </Spin>
              </div>
            </Col>
          </Row>
        </Tabs.TabPane>
        <Tabs.TabPane tab={"端口资产管理"} key={"port"}>
          <PortAssetTable/>
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default PortScanPage;
