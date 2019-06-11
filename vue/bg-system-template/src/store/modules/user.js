/* eslint-disable no-param-reassign */
/* eslint-disable no-shadow */
import { getToken, removeToken, setToken } from '@/utils/auth';
import { login } from '@/api/user';
import { resetRouter } from '@/router';

const state = {
  token: getToken(),
};

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
};

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { email, password } = userInfo;
    return new Promise((resolve, reject) => {
      login({ email: email.trim(), password }).then((response) => {
        const { data } = response;
        commit('SET_TOKEN', data.token);
        setToken(data.token);
        resolve();
      }).catch((error) => {
        reject(error);
      });
    });
  },

  logout({ commit }) {
    return new Promise((resolve) => {
      commit('SET_TOKEN', '');
      removeToken();
      resetRouter();
      resolve();
    });
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
