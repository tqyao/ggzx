// 对外暴露路由常量
export const constantRoute = [
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    name: 'login',
    meta: {
      title: '登录',
      hidden: true,
      icon: 'Promotion'
    }
  },
  {
    path: '/',
    component: () => import('@/layout/index.vue'),
    redirect: '/home',
    name: 'layout',
    meta: {
      title: '',
      hidden: false,
      icon: ''
    },
    children: [
      {
        path: '/home',
        component: () => import('@/views/home/index.vue'),
        name: 'home',
        meta: {
          title: '首页',
          hidden: false,
          icon: 'HomeFilled'
        },
        // test
        // children: [
        //   {
        //     path: '/test2',
        //     component: () => import('@/views/home/index.vue'),
        //     name: 'level3',
        //     meta: {
        //       title: 'level3',
        //       hidden: false,
        //       icon: 'Notification'
        //     }
        //   }
        // ]
      },
      {
        path: '/test1',
        component: () => import('@/layout/test/index.vue'),
        name: 'level2',
        meta: {
          title: 'level2',
          hidden: false,
          icon: 'Notification'
        }
      }
    ]
  },
  {
    path: '/404',
    component: () => import('@/views/404/index.vue'),
    name: '404',
    meta: {
      title: '404',
      hidden: true,
      icon: 'DocumentDelete'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
    name: 'Any',
    meta: {
      title: '任意路由',
      hidden: true,
      icon: 'DataLine'
    }
  }
]
