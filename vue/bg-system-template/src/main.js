import Vue from 'vue';
// antd relative
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
// import {
//   Button, Form, Tabs,
// } from 'ant-design-vue';
import {
  MenuItem, Submenu, Menu, Tooltip,
} from 'element-ui';

import App from './App.vue';
import store from './store';
import router from './router';

import './styles/index.scss';

import '@/icons'; // icon
import '@/permission';

Vue.use(Menu);
Vue.use(MenuItem);
Vue.use(Submenu);
Vue.use(Tooltip);

// permission control

// [Button, Form, Tabs].forEach((item) => {
//   Vue.component(item.name, item);
// });

Vue.use(Antd);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
