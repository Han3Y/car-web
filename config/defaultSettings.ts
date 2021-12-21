import { Settings as LayoutSettings } from '@ant-design/pro-layout';

const Settings: LayoutSettings & {
  pwa?: boolean;
  logo?: string;
  baseUrl?: string;
  serverUrl?: string;
} = {
  navTheme: 'realDark',
  // 拂晓蓝
  primaryColor: '#1890ff',
  layout: 'side',
  contentWidth: 'Fluid',
  fixedHeader: true,
  fixSiderbar: true,
  colorWeak: false,
  headerHeight: 48,
  title: '后台管理系统',
  pwa: false,
  logo: '/img/logo.png',
  iconfontUrl: '',
  baseUrl: '',
  serverUrl: 'api',

};

export default Settings;
