import type { Settings as LayoutSettings } from '@ant-design/pro-layout';
import { PageLoading } from '@ant-design/pro-layout';
import type { RunTimeLayoutConfig } from 'umi';
import { history, Link } from 'umi';
import RightContent from '@/components/RightContent';
import Footer from '@/components/Footer';
import { currentUser as queryCurrentUser } from './services/ant-design-pro/api';
import { BookOutlined, LinkOutlined } from '@ant-design/icons';
import { RequestConfig } from '@@/plugin-request/request';
import { notification } from 'antd';
import settings from '../config/defaultSettings';

const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';

/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
  loading: <PageLoading />,
};

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.CurrentUser;
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
}> {
  console.log('getInitialState');
  const fetchUserInfo = async () => {
    try {
      const msg = await queryCurrentUser();
      return msg.data;
    } catch (error) {
      history.push(loginPath);
    }
    return undefined;

  };
  // 如果是登录页面，不执行
  if (history.location.pathname !== loginPath) {
    const currentUser = await fetchUserInfo();
    return {
      fetchUserInfo,
      currentUser,
      settings: {},
    };
  }
  return {
    fetchUserInfo,
    settings: {},
  };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState }) => {
  return {
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    // waterMarkProps: {
    //   content: initialState?.currentUser?.userName,
    // },
    // footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;
      // 如果没有登录，重定向到 login
      if (!initialState?.currentUser && location.pathname !== loginPath) {
        history.push(loginPath);
      }
    },
    // links: isDev
    //   ? [
    //       <Link to="/umi/plugin/openapi" target="_blank">
    //         <LinkOutlined />
    //         <span>OpenAPI 文档</span>
    //       </Link>,
    //       <Link to="/~docs">
    //         <BookOutlined />
    //         <span>业务组件文档</span>
    //       </Link>,
    //     ]
    //   : [],
    menuHeaderRender: undefined,
    // 根据用户角色动态生成菜单
    menu: {
      locale: false,
      params: {
        userId: initialState?.currentUser?.id,
      },
      request: async () => {
        console.log('roles', initialState?.currentUser?.roles);
        if(initialState?.currentUser?.roles.includes(2)){
          return [
            {
              path: '/welcome',
              name: '欢迎',
              icon: 'icon-rizhi-nor',
              component: './Welcome',
            },
            {
              name: 'demo',
              icon: 'icon-rizhi-nor',
              path: '/demo',
              component: './demo',
            },
          ]
        }else if(initialState?.currentUser?.roles.includes(1)){
          return [
            {
              path: '/welcome',
              name: '欢迎',
              icon: 'icon-rizhi-nor',
              component: './Welcome',
            },
            {
              name: '会议',
              icon: 'icon-rizhi-nor',
              path: '/meetingList',
              component: './MeetingList',
            },
          ]
        }else{
          return [
            {
              path: '/welcome',
              name: '欢迎',
              icon: 'icon-rizhi-nor',
              component: './Welcome',
            },
          ]
        }
      }
    },
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 引入iconfont
    iconfontUrl: '/iconfont.js',
    ...initialState?.settings,
  };
};

const codeMessage: Record<number, string> = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

/**
 * @zh-CN 异常处理程序
 * @en-US Exception handler
 */
const errorHandler = (error: { response: Response }): Response => {
  const { response } = error;
  if (response && response.status) {
    const errorText = codeMessage[response.status] || response.statusText;
    const { status, url } = response;

    notification.error({
      message: `Request error ${status}: ${url}`,
      description: errorText,
    });
    if (status === 401) {
      history.push(loginPath);
    }
    // @ts-ignore
  } else if (response.result === false) {
    notification.error({
      description: '请求错误',
      // @ts-ignore
      message: response.msg,
    });
  } else if (!response) {
    notification.error({
      description: 'Your network is abnormal and cannot connect to the server',
      message: 'Network anomaly',
    });
  }
  return response;
};

const authHeaderInterceptor = (url: string, options: any) => {
  const authHeader = { Authorization: 'Bearer xxxxxx' };
  if (!url.startsWith('/sys') && !url.startsWith('http')) {
    url = `${settings.serverUrl + url}`;
  }
  return {
    url: `${url}`,
    options: { ...options, interceptors: true, headers: authHeader },
  };
};

const dataResponseInterceptors = (response: Response, options: any) => {
  return response;
};

export const request: RequestConfig = {
  errorConfig: {
    adaptor: (resData) => {
      return {
        data: resData.data,
        success: resData.result,
        errorMessage: resData.msg,
      };
    },
  },
  // @ts-ignore
  errorHandler,
  requestInterceptors: [authHeaderInterceptor],
  responseInterceptors: [dataResponseInterceptors],
};
