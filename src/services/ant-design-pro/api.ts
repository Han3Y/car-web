// @ts-ignore
/* eslint-disable */
import { request } from 'umi';
import ResponseVO from '@/beans/global/httpResVO';

/** 获取当前的用户 GET /api/currentUser */
export async function currentUser(options?: { [key: string]: any }) {
  return request<{
    data: API.CurrentUser;
  }>('/sys/user/current', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 退出登录接口 POST /api/login/outLogin */
export async function outLogin(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/login/outLogin', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 登录接口 POST /api/login/account */
export async function login(body: FormData, options?: { [key: string]: any }) {
  return request<ResponseVO<API.CurrentUser>>('/sys/login', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /api/notices */
export async function getNotices(options?: { [key: string]: any }) {
  return request<API.NoticeIconList>('/api/notices', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 获取规则列表 GET /api/rule */
export async function rule(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.RuleList>('/api/rule', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 新建规则 PUT /api/rule */
export async function updateRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/rule', {
    method: 'PUT',
    ...(options || {}),
  });
}

/** 新建规则 POST /api/rule */
export async function addRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/rule', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 删除规则 DELETE /api/rule */
export async function removeRule(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/rule', {
    method: 'DELETE',
    ...(options || {}),
  });
}

/** 获取会议列表 GET /meetingList */
export async function meetingList(
  params: {
    // query
    [key: string]: any;
  },
  options?: { [key: string]: any },
) {
  // 如果前端分页则直接返回res.data即可，res.data为数组
  const res = await request<any>('/meeting/meetingListByPage', {
    method: 'GET',
    params: {
      ...params,
      page: params.current,
    },
    ...(options || {}),
  });
  console.log('res', res);
  return {
    data: res.data.items,
    success: res.data.result,
    total: res?.data.total,
  };
}

/** 新建会议 POST /api/rule */
export async function addMeeting(options?: { [key: string]: any }) {
  return request<any>('/meeting', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 删除会议 DELETE /meeting */
export async function removeMeeting(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/meeting', {
    method: 'DELETE',
    ...(options || {}),
  });
}
