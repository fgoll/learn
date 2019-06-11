import Vue from 'vue';
import Router from 'vue-router';
import Layout from '@/layout';

Vue.use(Router);


export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login'),
    hidden: true,
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true,
  },
  {
    path: '/',
    name: '/',
    redirect: 'index/app',
    hidden: true,
  },

  {
    path: '/index/app',
    component: Layout,
    redirect: '/index/app/application',
    meta: { title: '我的应用', matched: '^/index' },
    children: [{
      path: 'application',
      name: 'application',
      meta: { title: '应用列表', icon: 'app' },
      component: () => import('@/views/index/app/application'),
    }, {
      path: 'device',
      name: 'device',
      meta: { title: '设备列表', icon: 'device' },
      component: () => import('@/views/index/app/device'),
    }],
  },

  {
    path: '/index/manager',
    component: Layout,
    redirect: '/index/manager/group',
    meta: { title: '管理', icon: 'example', matched: '^/index' },
    children: [
    //   {
    //   path: 'create',
    //   name: 'create',
    //   meta: { title: '创建应用', icon: 'create' },
    //   component: () => import('@/views/index/manager/create'),
    // },
      {
        path: 'group',
        name: 'group',
        meta: { title: '应用分组', icon: 'group' },
        component: () => import('@/views/index/manager/group'),
      },
      {
        path: 'basic',
        name: 'basic',
        meta: { title: '个人中心', icon: 'basic' },
        component: () => import('@/views/index/manager/center'),
      }],
  },

  {
    path: '/app/service',
    component: Layout,
    redirect: '/app/service/dashboard',
    meta: { title: '服务', icon: 'example', matched: '^/app' },
    children: [{
      path: 'dashboard',
      name: 'dashboard',
      meta: { title: '概况', icon: 'dashboard' },
      component: () => import('@/views/app/service/dashboard'),
    }, {
      path: 'package',
      name: 'service/package',
      open: true,
      meta: { title: '打包服务', icon: 'package', nodirect: true },
      component: () => import('@/views/app/service/package'),
      children: [{
        path: 'detail',
        name: 'package/detail',
        meta: { title: '发起打包', icon: 'sponsor', breadTitle: '创建打包任务' },
        component: () => import('@/views/app/service/package/detail'),
      }, {
        path: 'task',
        name: 'task',
        meta: { title: '打包任务', icon: 'task' },
        component: () => import('@/views/app/service/package/list'),
      }],
    }],
  },
  {
    path: '/app/manager',
    component: Layout,
    redirect: '/app/manager/branch',
    meta: { title: '管理', icon: 'example', matched: '^/app' },
    children: [
      {
        path: 'branch',
        name: 'branch',
        meta: { title: '代码分支', icon: 'bransh' },
        component: () => import('@/views/app/manager/branch'),
      },
    ],
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true },
];

const createRouter = () => new Router({
  routes: constantRoutes,
  mode: 'history',
});

const router = createRouter();

// see https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher;
}

export default router;
