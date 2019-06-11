const getters = {
  token: state => state.user.token,
  currentApp: state => state.app.current,
  sidebar: state => state.settings.sidebar,
};

export default getters;
