import Vue from 'vue';
import Vuex from 'vuex';
import getters from './getters';
import user from './modules/user';
import app, { recover } from './modules/app';

Vue.use(Vuex);

// recover current application
recover();

const store = new Vuex.Store({
  modules: {
    user,
    app,
  },
  getters,
});

export default store;
