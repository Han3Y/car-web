import type { Settings as LayoutSettings } from '@ant-design/pro-layout';
import { PageLoading } from '@ant-design/pro-layout';
import type { RunTimeLayoutConfig } from 'umi';
import { history, Link, useLocation } from 'umi';
import RightContent from '@/components/RightContent';
import Footer from '@/components/Footer';
import { currentUser as queryCurrentUser } from './services/ant-design-pro/api';
import { ArrowLeftOutlined, BookOutlined, HomeOutlined, LinkOutlined } from '@ant-design/icons';
import { RequestConfig } from '@@/plugin-request/request';
import { notification } from 'antd';
import settings from '../config/defaultSettings';
import { createRef } from 'react';

const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';

/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
  loading: <PageLoading />,
};

/**
 * 不同模块菜单
 */
const firstMenu = [
  {
    path: '/home',
    name: '主页',
    icon: <HomeOutlined />,
    component: './home',
  },
  {
    name: '零部件安全检查子系统',
    path: '/tbox',
    icon: 'icon-lingjian1',
    component: './demo',
  },
  {
    name: '漏洞库',
    path: '/vul',
    icon: 'icon-webloudongjiance',
    component: './demo',
  },
  {
    name: '渗透测试工具集',
    path: '/baseline',
    icon: 'icon-ceshi',
    component: './demo',
  },
  {
    name: '车外通信协议安全检测工具',
    path: '/cellular',
    icon: 'icon-tongxunxieyi',
    component: './demo',
  },
];

const moduleMenu = {
  partsDetection: [
    {
      name: 'T-BOX安全检测',
      path: '/tbox',
      icon: 'icon-t-box-line',
      component: './demo',
    },
    {
      name: '车载信息娱乐系统安全检测',
      path: '/qube',
      icon: 'icon-qichexiangguan-cheji',
      component: './demo',
    },
    {
      name: 'ECU安全检测',
      path: '/ecu',
      icon: 'icon-kongzhi',
      component: './demo',
    },
    {
      name: '车载OS安全检测',
      path: '/os',
      icon: 'icon-05',
      component: './demo',
    },
    {
      name: 'OBD接入安全检测',
      path: '/obd',
      icon: 'icon-xitongzhuangtai',
      component: './demo',
    },
    {
      name: '车外网络传输安全检测',
      path: '/net',
      icon: 'icon-wangluo',
      component: './demo',
    },
    {
      name: '终端升级安全检测',
      path: '/terminal',
      icon: 'icon-yunzhongduan-shouye',
      component: './demo',
    },
    {
      name: '智能车钥匙安全检测',
      path: '/key',
      icon: 'icon-yuechi',
      component: './demo',
    },
    {
      name: '胎压检测系统安全检测',
      path: '/tirePressure',
      icon: 'icon-luntai',
      component: './demo',
    },
    {
      name: '车辆定位系统安全检测',
      path: '/gps',
      icon: 'icon-qichedingwei',
      component: './demo',
    },
  ],
  vul: [
    {
      name: '漏洞库',
      path: '/vul',
      icon: 'icon-webloudongjiance',
      component: './demo',
    },
  ],
  penetrationTest: [
    {
      name: '基线检测工具',
      path: '/baseline',
      icon: 'icon-changyongtubiao_jixianguanli',
      component: './demo',
    },
    {
      name: '端口扫描工具',
      path: '/port',
      icon: 'icon-port',
      component: './demo',
    },
    {
      name: '无线安全攻击工具',
      path: '/wireless',
      icon: 'icon-wuxian1',
      component: './demo',
    },
    {
      name: '脆弱性检测工具',
      path: '/fragility',
      icon: 'icon-Vulnerability-analysis',
      component: './demo',
    },
    {
      name: '协议检测工具',
      path: '/protocol',
      icon: 'icon-yonghuxieyi',
      component: './demo',
    },
  ],
  protocolDetection: [
    {
      name: '蜂窝网络',
      path: '/cellular',
      icon: 'icon-beehive',
      component: './demo',
    },
    {
      name: 'wifi',
      path: '/wifi',
      icon: 'icon-wuxian',
      component: './demo',
    },
    {
      name: '蓝牙',
      path: '/bluetooth',
      icon: 'icon-lanya',
      component: './demo',
    },
  ],
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
  // const location = useLocation();
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
export const layoutActionRef = createRef<{ reload: () => void }>();
export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState }) => {
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
      layoutActionRef.current?.reload();
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
    actionRef: layoutActionRef,
    // 根据用户角色动态生成菜单
    menu: {
      locale: false,
      params: {
        // currentPath: initialState?.currentPath
      },
      request: async () => {
        const currentPath = history.location.pathname;
        for (let key in moduleMenu) {
          for (let i = 0; i < moduleMenu[key].length; i++) {
            if (moduleMenu[key][i].path === currentPath) {
              return [
                {
                  path: '/home',
                  name: '返回主页',
                  icon: <ArrowLeftOutlined />,
                  component: './home',
                },
              ].concat(moduleMenu[key]);
            }
          }
        }
        return firstMenu;
        // if(initialState?.currentUser?.roles.includes(2)){
        //   return [
        //     {
        //       path: '/home',
        //       name: '首页',
        //       component: './home',
        //     },
        //     {
        //       name: 'demo',
        //       path: '/demo',
        //       component: './demo',
        //     },
        //   ]
        // }else if(initialState?.currentUser?.roles.includes(1)){
        //   return [
        //     {
        //       path: '/home',
        //       name: '首页',
        //       component: './home',
        //     },
        //     {
        //       name: '会议',
        //       path: '/meetingList',
        //       component: './MeetingList',
        //     },
        //   ]
        // }else{
        //   return [
        //     {
        //       path: '/home',
        //       name: '首页',
        //       component: './home',
        //     },
        //   ]
        // }
      },
    },
    siderWidth: 230,
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
