/* eslint-disable no-param-reassign */
/* eslint-disable import/no-extraneous-dependencies */
import axios from 'axios';
import { getToken } from '@/utils/auth';
import { message, Modal } from 'ant-design-vue';
import qs from 'qs';
import store from '../store';
// import router from '../router';

let modalHook = false;

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_URL,
  timeout: 5000,
  transformRequest: [function transform(data) {
    // data['src'] = 'dev'
    if (data instanceof FormData) {
      return data;
    }
    data = qs.stringify(data);
    return data;
  }],
});

service.interceptors.request.use(
  (config) => {
    config.headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
    if (store.getters.token) {
      config.headers.Authorization = `Bearer ${getToken()}`;
    }
    return config;
  },
  error => Promise.reject(error),
);

service.interceptors.response.use(
  (response) => {
    // eslint-disable-next-line no-console
    console.log(response);
    const res = response.data;

    if (res.status === 1) {
      return res;
    }
    if (res.message) message.error(res.message);
    return Promise.reject(res.message);
  },
  (error) => {
    if (error && error.response) {
      switch (error.response.status) {
        case 400:
          error.message = '请求错误';
          break;
        case 401:
          error.message = '未授权，请登录';

          if (!modalHook) {
            if (process.env.NODE_ENV !== 'development') {
              //   store.dispatch('user/logout');
              //   router.push('/login');
              modalHook = true;

              Modal.confirm({
                title: '确认退出',
                content: '你已经注销了, 你可以取消继续留在该页面或者重新登录',
                onOk() {
                  store.dispatch('user/logout').then(() => {
                  // eslint-disable-next-line no-restricted-globals
                    location.reload();
                  });
                  modalHook = false;
                },
                onCancel() {
                  modalHook = false;
                },
              });
            }
          }

          break;
        case 403:
          error.message = '拒绝访问';
          break;
        case 404:
          error.message = `请求地址出错: ${error.response.config.url}`;
          break;
        case 408:
          error.message = '请求超时';
          break;
        case 500:
          error.message = '服务器内部错误';
          break;
        case 501:
          error.message = '服务未实现';
          break;
        case 502:
          error.message = '网关错误';
          break;
        case 503:
          error.message = '服务不可用';
          break;
        case 504:
          error.message = '网关超时';
          break;
        case 505:
          error.message = 'HTTP版本不受支持';
          break;
        default:
      }
    }
    if (error.message) message.error(error.message);
    return Promise.reject(error);
  },
);

export default service;
