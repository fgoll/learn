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
    path: '/',
    redirect: 'index/app',
    hidden: true,
  },

  {
    path: '/index/app',
    component: Layout,
    redirect: '/index/app/application',
    meta: { title: '我的应用', icon: 'example', matched: '^/index' },
    children: [{
      path: 'application',
      name: 'application',
      meta: { title: '应用列表', icon: 'example' },
      component: () => import('@/views/index/app/application'),
    }, {
      path: 'device',
      name: 'device',
      meta: { title: '设备列表', icon: 'example' },
      component: () => import('@/views/index/app/device'),
    }],
  },

  {
    path: '/index/manager',
    component: Layout,
    redirect: '/index/manager/create',
    meta: { title: '管理', icon: 'example', matched: '^/index' },
    children: [{
      path: 'create',
      name: 'create',
      meta: { title: '创建应用', icon: 'example' },
      component: () => import('@/views/index/manager/create'),
    }, {
      path: 'group',
      name: 'group',
      meta: { title: '应用分组', icon: 'example' },
      component: () => import('@/views/index/manager/group'),
    }, {
      path: 'center',
      name: 'center',
      meta: { title: '个人中心', icon: 'example' },
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
      meta: { title: '概况', icon: 'example' },
      component: () => import('@/views/app/service/dashboard'),
    }, {
      path: 'package',
      name: 'package',
      meta: { title: '打包服务', icon: 'example' },
      component: () => import('@/views/app/service/package'),
      children: [{
        path: 'sponsor',
        name: 'sponsor',
        meta: { title: '发起打包', icon: 'example' },
      }, {
        path: 'task',
        name: 'task',
        meta: { title: '打包任务', icon: 'example' },
      }],
    }],
  },

  {
    path: '/app/manager',
    component: Layout,
    redirect: '/app/manager/branch',
    meta: { title: '管理', icon: 'example', matched: '^/app' },
    children: [{
      path: 'branch',
      name: 'branch',
      meta: { title: '代码分支', icon: 'example' },
      component: () => import('@/views/app/manager/branch'),
    }],
  },
];

const createRouter = () => new Router({
  routes: constantRoutes,
});

const router = createRouter();

// see https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher;
}

export default router;
