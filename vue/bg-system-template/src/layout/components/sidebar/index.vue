<template>
  <div class="sidebar">
    <el-menu
      :default-active="activeMenu"
      :collapse="isCollapse"
      :unique-opened="false"
      :collapse-transition="false"
      :default-openeds="openeds"
      mode="vertical"
    >
      <sidebar-item
        v-for="route in routes"
        :key="route.path"
        :item="route"
        :base-path="route.path"
      />
    </el-menu>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
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
    ...mapGetters([
      'sidebar',
    ]),
    routes() {
      const matched = this.$route.matched[0].path;
      const router = this.$router.options.routes.filter(item => item.path === matched)[0] || null;
      if (!router) return [];

      return router.children || [];
    },
    openeds() {
      const matched = this.$route.matched[0].path;
      const router = this.$router.options.routes.filter(item => item.path === matched)[0] || null;
      if (!router) return [];

      return router.children.filter(r => r.open).map(r => r.name) || [];
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
      return !this.sidebar.opened;
    },
  },
};
</script>
