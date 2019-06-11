<template>
  <div
    class="app-wrapper"
    :class="classObj"
  >
    <sidebar />
    <div class="main-container">
      <navbar />
      <app-main />
    </div>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain } from './components';

export default {
  name: 'Layout',
  components: {
    Navbar,
    Sidebar,
    AppMain,
  },
  data() {
    return {};
  },
  computed: {
    sidebar() {
      return this.$store.state.settings.sidebar;
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
      };
    },
  },
};
</script>

<style lang="scss">
.main-container {
  margin-left: 210px;
}
</style>
