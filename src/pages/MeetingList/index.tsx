import React, { useRef, useState } from 'react';
import { FooterToolbar, PageContainer } from '@ant-design/pro-layout';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { Button, message, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { addMeeting, meetingList, removeMeeting, removeRule } from '@/services/ant-design-pro/api';
import {
  ModalForm,
  ProFormDateRangePicker,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-form';
import {
  LAYOUT_HORIZONTAL,
  LAYOUT_TYPE_HORIZONTAL,
  LONG_MODAL_WIDTH,
} from '../../../config/uiConfig';
import { INT_VALIDATOR, NAME_PATTERN, VALIDATOR_MSG } from '../../../config/validate';
import { ExclamationCircleOutlined } from '@ant-design/icons/lib';
const { confirm } = Modal;

/**
 *  Delete node
 * @zh-CN 删除节点
 *
 * @param selectedRows
 */
const handleRemove = async (selectedRows: API.MeetingListItem[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    await removeMeeting({
      params: {
        id: selectedRows.map((meeting) => meeting.id),
      },
    });
    hide();
    message.success('删除成功');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败');
    return false;
  }
};

const MeetingList: React.FC = () => {
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [selectedRowsState, setSelectedRows] = useState<API.MeetingListItem[]>([]);
  const [currentRow, setCurrentRow] = useState<API.MeetingListItem>();
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [initFormValue, setInitFormValue] = useState({});
  const _initValue = {};
  const actionRef = useRef<ActionType>();

  const columns: ProColumns<API.MeetingListItem>[] = [
    {
      title: '名称',
      dataIndex: 'meetingName',
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              setCurrentRow(entity);
              setShowDetail(true);
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: '内容',
      dataIndex: 'meetingContent',
      filters: true,
      onFilter: true,
      valueType: 'select',
      valueEnum: {
        all: { text: '全部', status: 'Default' },
        open: {
          text: '未解决',
          status: 'Error',
        },
        closed: {
          text: '已解决',
          status: 'Success',
          disabled: true,
        },
        processing: {
          text: '解决中',
          status: 'Processing',
        },
      },
    },
    {
      title: '开始时间',
      dataIndex: 'meetingStartTime',
      search: false,
    },
    {
      title: '结束时间',
      dataIndex: 'meetingEndTime',
      search: false,
    },
    {
      title: '会议时间',
      dataIndex: 'created_at',
      valueType: 'dateRange',
      hideInTable: true,
      search: {
        transform: (value) => {
          return {
            meetingStartTime: value[0],
            meetingEndTime: value[1],
          };
        },
      },
    },
    {
      title: '操作',
      valueType: 'option',
      render: (text, record, _, action) => [
        <a
          key="editable"
          onClick={() => {
            setInitFormValue({
              name: record.meetingName,
            });
            handleModalVisible(true);
          }}
        >
          编辑
        </a>,
        <a
          key="delete"
          onClick={() => {
            confirm({
              title: '提示',
              content: `确认删除这-${record.meetingName}?`,
              icon: <ExclamationCircleOutlined />,
              onOk() {
                console.log('OK');
                console.log('删除', record.id);
                actionRef.current?.reloadAndRest?.();
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
      <ProTable<API.MeetingListItem, API.PageParams>
        headerTitle="会议管理"
        rowKey="id"
        actionRef={actionRef}
        options={false}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              setInitFormValue({ name: '123' });
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
                    setSelectedRows([]);
                    actionRef.current?.reloadAndRest?.();
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
        request={meetingList}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />
      {/*{selectedRowsState?.length > 0 && (*/}
      {/*  <FooterToolbar*/}
      {/*    extra={*/}
      {/*      <div>*/}
      {/*        已选择*/}
      {/*        <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a>{' '}*/}
      {/*        项*/}
      {/*        &nbsp;&nbsp;*/}
      {/*      </div>*/}
      {/*    }*/}
      {/*  >*/}
      {/*    <Button*/}
      {/*      onClick={async () => {*/}
      {/*        await handleRemove(selectedRowsState);*/}
      {/*        setSelectedRows([]);*/}
      {/*        actionRef.current?.reloadAndRest?.();*/}
      {/*      }}*/}
      {/*    >*/}
      {/*     批量删除*/}
      {/*    </Button>*/}
      {/*  </FooterToolbar>*/}
      {/*)}*/}
      {createModalVisible && (
        <ModalForm
          validateMessages={VALIDATOR_MSG}
          title="会议信息"
          initialValues={initFormValue}
          modalProps={{
            wrapClassName: 'custom-form-modal',
          }}
          {...LAYOUT_TYPE_HORIZONTAL}
          layout={LAYOUT_HORIZONTAL}
          width={LONG_MODAL_WIDTH}
          visible={createModalVisible}
          onVisibleChange={handleModalVisible}
          onFinish={async (value): Promise<boolean> => {
            const data = {
              data: {
                meetingName: value.name,
                meetingContent: value.desc,
                meetingStartTime: value.dateRange[0] + ' 00:00:00',
                meetingEndTime: value.dateRange[1] + ' 00:00:00',
              },
            };
            const res = await addMeeting(data);
            if (res.result) {
              message.success('提交成功');
              actionRef?.current?.reload();
              return true;
            } else {
              return false;
            }
          }}
        >
          <ProFormText
            label="会议名称"
            rules={[
              {
                required: true,
              },
              {
                message: VALIDATOR_MSG.name,
                pattern: NAME_PATTERN,
              },
            ]}
            width="md"
            name="name"
          />
          <ProFormTextArea
            rules={[
              {
                validator: INT_VALIDATOR,
              },
            ]}
            label="会议内容"
            width="md"
            name="desc"
          />
          <ProFormDateRangePicker
            label="起止时间"
            width="md"
            name="dateRange"
            rules={[
              {
                required: true,
              },
            ]}
          />
        </ModalForm>
      )}
    </PageContainer>
  );
};

export default MeetingList;
