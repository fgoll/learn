// import { message } from 'ant-design-vue';
import { getToken } from '@/utils/auth';
import NProgress from 'nprogress';
import getPageTitle from '@/utils/get-page-title';
import router from './router';
// import store from './store';

const whiteList = ['/login'];

router.beforeEach((to, from, next) => {
  // start progress bar
  NProgress.start();

  document.title = getPageTitle(to.meta.title);

  const hasToken = getToken();
  // console.log(to);
  if (hasToken) {
    if (to.path === '/login') {
      // already login, redirect to the home page
      next({ path: '/' });
      NProgress.done();
    } else {
      next();
    }
  } else if (whiteList.indexOf(to.path) !== -1) {
    // if in whitelist, go directly
    next();
  } else {
    // other pages that do not have permission to access are redirected to the login page.
    next(`/login?redirect=${to.path}`);
    NProgress.done();
  }
});
