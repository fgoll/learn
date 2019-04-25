<template>
  <div class="sidebar">
    <div class="logo"></div>
    <el-menu
      :default-active="activeMenu"
      :collapse="isCollapse"
      :unique-opened="false"
      :collapse-transition="false"
      mode="vertical">
      <sidebar-item v-for="route in routes"
                    :item="route"
                    :key="route.path"
                    :base-path="route.path"/>
    </el-menu>

  </div>
</template>

<script>
import SidebarItem from './sidebar-item';

export default {
  components: {
    SidebarItem,
  },
  data() {
    return {
      collapsed: false,
    };
  },
  computed: {
    routes() {
      const matched = this.$route.matched[0].path;
      const router = this.$router.options.routes.filter(item => item.path === matched)[0] || null;
      if (!router) return [];

      return router.children || [];
    },
    activeMenu() {
      const route = this.$route;
      const { meta, name } = route;
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      return name;
    },
    isCollapse() {
      return false;
    },
  },
};
</script>

<style lang="scss">
@import "~@/styles/variables.scss";
.sidebar {
  transition: width 0.28s;
  width: $sideBarWidth !important;
  background-color: $menuBg;
  height: 100%;
  position: fixed;
  font-size: 0px;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 1001;
  overflow: hidden;
}
</style>
