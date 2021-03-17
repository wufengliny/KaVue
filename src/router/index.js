import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    hidden: false,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        hidden: false,
        meta: { title: '主页', icon: 'dashboard', affix: true }
      }
    ]
  }
]
// hidden：bool 是否显示在菜单栏
// affix:  bool 标签栏是否固定 即打开后该导航的右边是否会有一个*关掉的小按钮
// redirect:面包屑导航中点击跳转的地址
export const katestRoutes = [
  {
    path: '/power',
    name: 'power',
    component: Layout,
    redirect: '/power/admin',
    hidden: false,
    meta: {
      title: '权限管理',
      icon: 'eye'
    },
    children: [
      {
        path: 'admin',
        component: () => import('@/views/power/admin'),
        name: 'power_admin',
        hidden: false,
        meta: { title: '管理员', icon: '', noCache: true } // meta菜单显示信息  不管用
      },
      {
        path: 'Adg',
        component: () => import('@/views/power/adg'),
        name: 'power_admingroup',
        hidden: false,
        meta: { title: '管理员组', icon: '', noCache: true }
      }
    ]
  },
  {
    path: '/log',
    name: 'log',
    component: Layout,
    redirect: '/log/login',
    hidden: false,
    meta: {
      title: '日志管理',
      icon: 'eye-open'
    },
    children: [
      {
        path: 'login',
        component: () => import('@/views/log/login'),
        name: 'log_login',
        hidden: false,
        meta: { title: '登陆日志', icon: '', noCache: false } // meta菜单显示信息
      },
      {
        path: 'request',
        component: () => import('@/views/log/request'),
        name: 'log_request',
        hidden: false,
        meta: { title: '请求日志', icon: '' }
      },
      {
        path: 'error',
        component: () => import('@/views/log/error'),
        name: 'log_error',
        hidden: false,
        meta: { title: '错误日志', icon: '' }
      }
    ]
  },
  {
    path: '/test',
    name: 'test',
    component: Layout,
    redirect: '/test/index',
    hidden: false,
    meta: {
      title: '测试',
      icon: 'bug'
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/test/index'),
        name: 'test_one',
        hidden: false,
        meta: { title: '测试一', icon: '' } // meta菜单显示信息
      },
      {
        path: 'Adg',
        component: () => import('@/views/test/adg'),
        name: 'test_two',
        hidden: false,
        meta: { title: '测试二', icon: '' }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]
const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
