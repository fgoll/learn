/* eslint-disable no-shadow */
/* eslint-disable no-param-reassign */
/**
 * app detail relative
 */

const KEY = 'APP_CURRENT';


const state = {
  current: null,
};

const mutations = {
  SET_CURRENT: (state, current) => {
    state.current = current;
    localStorage.setItem(KEY, current);
  },
};


export function recover() {
  const item = localStorage.getItem(KEY);
  if (item) {
    mutations.SET_CURRENT(state, item);
  }
}

export default {
  namespaced: true,
  state,
  mutations,
};
