import axios from 'axios';
import { getToken } from '@/utils/auth';
import { message } from 'ant-design-vue';
import store from '../store';

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000,
});

service.interceptors.request.use(
  (config) => {
    if (store.getters.token) {
      return { ...config, ['headers'['X-Token']]: getToken() };
    }
    return config;
  },
  error => Promise.reject(error),
);

service.interceptors.response.use(
  (response) => {
    const res = response.data;
    return res;
  },
  (error) => {
    message.error(error.message);
    return Promise.reject(error);
  },
);

export default service;
