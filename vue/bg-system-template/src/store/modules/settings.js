/* eslint-disable no-param-reassign */
/* eslint-disable no-shadow */
import Cookies from 'js-cookie';

const KEY = 'SETTING_SIDEBARSTATUS';

const state = {
  sidebar: {
    opened: Cookies.get(KEY) ? !!+Cookies.get(KEY) : true,
    withoutAnimation: false,
  },
};

const mutations = {
  TOGGLE_SIDEBAR: (state) => {
    state.sidebar.opened = !state.sidebar.opened;
    state.sidebar.withoutAnimation = false;
    if (state.sidebar.opened) {
      Cookies.set(KEY, 1);
    } else {
      Cookies.set(KEY, 0);
    }
  },
  CLOSE_SIDEBAR: (state, withoutAnimation) => {
    Cookies.set(KEY, 0);
    state.sidebar.opened = false;
    state.sidebar.withoutAnimation = withoutAnimation;
  },
  TOGGLE_DEVICE: (state, device) => {
    state.device = device;
  },
};

const actions = {
  toggleSideBar({ commit }) {
    commit('TOGGLE_SIDEBAR');
  },
  closeSideBar({ commit }, { withoutAnimation }) {
    commit('CLOSE_SIDEBAR', withoutAnimation);
  },
  toggleDevice({ commit }, device) {
    commit('TOGGLE_DEVICE', device);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
