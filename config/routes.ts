export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: './user/Login',
          },
        ],
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/welcome',
    name: '欢迎',
    icon: 'icon-rizhi-nor',
    component: './Welcome',
  },
  {
    path: '/admin',
    name: '管理员页面',
    icon: 'icon-rizhi-nor',
    access: 'canAdmin',
    component: './Admin',
    routes: [
      {
        path: '/admin/sub-page',
        name: '管理员-子页面',
        icon: 'smile',
        component: './Welcome',
      },
      {
        component: './404',
      },
    ],
  },
  {
    name: '会议',
    icon: 'icon-rizhi-nor',
    path: '/meetingList',
    component: './MeetingList',
  },
  {
    name: 'demo',
    icon: 'icon-rizhi-nor',
    path: '/demo',
    component: './demo',
  },
  {
    name: '会议室',
    icon: 'icon-rizhi-nor',
    path: '/meetingRoomList',
    component: './TableList',
  },
  {
    path: '/',
    redirect: '/welcome',
  },
  {
    component: './404',
  },
];
