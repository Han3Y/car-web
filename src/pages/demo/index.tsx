import React, {useRef, useState} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import ProTable, {ActionType, ProColumns} from '@ant-design/pro-table';
import {Button, message, Modal} from 'antd';
import {ExclamationCircleOutlined, PlusOutlined} from '@ant-design/icons';
import {DemoListVO} from "@/beans/demo/demoListVO";
import {DemoDTO} from "@/beans/demo/demoDTO";
import DemoService from "@/services/demo";
import DemoEditModal from "@/pages/demo/components/modal";
import {VALIDATOR_MSG} from "../../../config/validate";
import {
  LAYOUT_HORIZONTAL,
  LAYOUT_TYPE_HORIZONTAL,
  LONG_MODAL_WIDTH,
  MODEL_TITLE,
  MODEL_TYPE
} from "../../../config/uiConfig";

const { confirm } = Modal;

const DemoList: React.FC = () => {
  // 新增、编辑弹窗是否可见
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  // 列表的勾选项数组
  const [selectedRowsState, setSelectedRows] = useState<DemoListVO[]>([]);
  // 当前选中的项
  const [currentRow, setCurrentRow] = useState<DemoListVO>();
  // 新增、编辑弹窗初始化的值
  const [initFormValue, setInitFormValue] = useState<DemoDTO>({});
  const _initValue: DemoDTO = {};
  const [modalTitle, setModalTitle] = useState<MODEL_TITLE>(MODEL_TITLE.CREATE);
  const [modalType, setModalType] = useState<MODEL_TYPE>(MODEL_TYPE.CREATE);
  // table实例
  const actionRef = useRef<ActionType>();
  // table列
  const columns : ProColumns<DemoListVO> [] = [
    {
      title: '名称',
      dataIndex: 'name',
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              setCurrentRow(entity);
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: '操作',
      valueType: 'option',
      render: (text, record, _, action) => [
        <a
          key="editable"
          onClick={() => {
            DemoService.getEditInfoById(record.id).then(res => {
              setModalTitle(MODEL_TITLE.EDIT);
              setModalType(MODEL_TYPE.EDIT);
              setInitFormValue(res.data);
              handleModalVisible(true);
            })
          }}
        >
          编辑
        </a>,
        <a
          key="delete"
          onClick={() => {
            confirm({
              title: '提示',
              content: `确认删除-${record.id}?`,
              icon: <ExclamationCircleOutlined />,
              onOk() {
                console.log('OK');
                console.log('删除', record.id);
                const hide = message.loading('正在删除');
                DemoService.deleteById(record.id).then(res => {
                  if(res.result){
                    message.success('删除成功');
                    actionRef.current?.reloadAndRest?.();
                  }
                }).finally(() => {
                  hide();
                });

              },
              onCancel() {
                console.log('Cancel');
              },
            });
          }}
        >
          删除
        </a>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<DemoListVO, API.PageParams>
        headerTitle="demo管理"
        rowKey="id"
        actionRef={actionRef}
        options={false}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              setModalTitle(MODEL_TITLE.CREATE);
              setModalType(MODEL_TYPE.CREATE);
              setInitFormValue(_initValue);
              handleModalVisible(true);
            }}
          >
            <PlusOutlined />
            新建
          </Button>,
          selectedRowsState?.length > 0 ? (
            <Button
              onClick={async () => {
                confirm({
                  title: '提示',
                  content: `确认删除这${selectedRowsState.length}项?`,
                  icon: <ExclamationCircleOutlined />,
                  onOk() {
                    console.log('OK');
                    console.log('selected', selectedRowsState);
                    const hide = message.loading('正在删除');
                    DemoService.batchDelete(selectedRowsState.map((item => item.id)))
                      .then(res => {
                        if(res.result){
                          message.success('删除成功');
                          setSelectedRows([]);
                          actionRef.current?.reloadAndRest?.();
                        }
                    }).finally(() => {
                        hide();
                    })

                  },
                  onCancel() {
                    console.log('Cancel');
                  },
                });
              }}
            >
              批量删除
            </Button>
          ) : (
            ''
          ),
        ]}
        columns={columns}
        request={DemoService.listByPage}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      >
      </ProTable>
      {createModalVisible && (
        <DemoEditModal
          validateMessages={VALIDATOR_MSG}
          title={modalTitle}
          initialValues={initFormValue}
          modalProps={{
            wrapClassName: 'custom-form-modal',
          }}
          {...LAYOUT_TYPE_HORIZONTAL}
          layout={LAYOUT_HORIZONTAL}
          width={LONG_MODAL_WIDTH}
          visible={createModalVisible}
          onVisibleChange={handleModalVisible}
          onFinish={async (value: DemoDTO): Promise<boolean> => {
            let data = {
              company: "2",
              department: "123",
              email: "22@qq.com",
              id: initFormValue.id,
              name: value.name,
              phone: "18888888888",
            }
            let res;
            if(modalType === MODEL_TYPE.CREATE){
              res = await DemoService.add(data);
            }else{
              res = await DemoService.edit(data);
            }
            if (res.result) {
              message.success('保存成功');
              actionRef?.current?.reload();
              return true;
            } else {
              return false;
            }
          }}
        />
      )}
    </PageContainer>
  )
};

export default DemoList;
