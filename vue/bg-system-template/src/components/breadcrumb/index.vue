<template>
  <a-breadcrumb
    class="breadcrumb"
    separator="/"
  >
    <!-- <transition-group name="breadcrumb"> -->
    <template v-for="(item, index) in levelList">
      <a-breadcrumb-item
        v-if="index===levelList.length-1"
        :key="item.path"
        class="active"
      >
        {{ item.meta.breadTitle ? item.meta.breadTitle : item.meta.title }}
      </a-breadcrumb-item>
      <a-breadcrumb-item
        v-else-if="item.meta.nodirect"
        :key="item.path"
        :href="item.path"
        class="disabled"
      >
        {{ item.meta.breadTitle ? item.meta.breadTitle : item.meta.title }}
      </a-breadcrumb-item>
      <a-breadcrumb-item
        v-else
        :key="item.path"
        :href="item.path"
        @click.native="handleLink(item)"
      >
        {{ item.meta.breadTitle ? item.meta.breadTitle : item.meta.title }}
      </a-breadcrumb-item>
    </template>
    <!-- </transition-group> -->
  </a-breadcrumb>
</template>

<script>
export default {
  data() {
    return {
      levelList: null,
    };
  },
  watch: {
    $route() {
      this.getBreadcrumb();
    },
  },
  created() {
    this.getBreadcrumb();
  },
  methods: {
    getBreadcrumb() {
      // only show routes with meta.title
      let matched = this.$route.matched.filter(item => item.meta && item.meta.title);

      if (!this.isDashboard(matched[0])) {
        matched = [{ name: 'application', meta: { title: '全部应用' } }].concat(matched);
      }

      const temp = [];
      for (let i = 0; i < matched.length; i += 1) {
        const match = matched[i];
        if (match.meta.parent) {
          temp.push(match.meta.parent);
        }
        temp.push(match);
      }
      this.levelList = temp.filter(item => item.meta
                                              && item.meta.title
                                              && item.name);
    },
    isDashboard(route) {
      const path = route && route.path;
      if (!path) {
        return false;
      }
      return path.trim().toLocaleLowerCase() === '/index/app';
    },
    handleLink(item) {
      const { name } = item;
      this.$router.push({ name });
    },
  },
};
</script>

<style lang="scss">
  .active {
    .ant-breadcrumb-link {
      font-size: 16px;
      font-weight: 500;
      color: #333;
    }
  }

  .disabled {

    .ant-breadcrumb-link {

        cursor: not-allowed;
        &:hover {
          color: #999;
        }

    }
  }
</style>
