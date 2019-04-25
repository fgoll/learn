<template>
  <div class="navbar">
    <hamburger :is-active="true" class="navbar__hamburger"/>
    <a-select
      showSearch
      placeholder="选择应用"
      optionFilterProp="children"
      style="width: 150px;"
    >
      <a-select-option value="all">全部应用</a-select-option>
      <a-select-option value="a">宝宝巴士App-B</a-select-option>
      <a-select-option value="b">宝宝巴士App-C</a-select-option>
    </a-select>

    <div class="navbar__tabs">
      <div class="navbar__tabs-wrap">
        <div>
          <router-link :to="route.path"
                       class="navbar__tabs-item" v-for="route in routes"
                       :key="route.path">
            {{route.meta.title}}
          </router-link>
        </div>
        <!-- <div class="ant-tabs-ink-bar ant-tabs-ink-bar-animated"></div> -->
      </div>

    </div>

    <a-badge class="navbar__note">
      <a-icon type="bell"/>
    </a-badge>

    <div class="navbar__user">
      <a-avatar>USER</a-avatar>
      <span>user</span>
    </div>
  </div>
</template>

<script>
import Hamburger from '@/components/Hamburger';

export default {
  components: {
    Hamburger,
  },
  computed: {
    routes() {
      const { matched } = this.$route.matched[0].meta;

      const routes = this.$router.options.routes.filter(item => !item.hidden
            && new RegExp(matched).test(item.path));

      return routes;
    },
  },
  methods: {
  },
};
</script>

<style lang="scss" scoped>
$height: 50px;
.navbar {
  height: $height;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  display: flex;
  align-items: center;

  &__hamburger {
    line-height: $height - 4;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  &__tabs {
    flex: 1;
    height: 100%;
    display: flex;
    justify-content: center;

    &-wrap {
      > div {
        display: flex;
        position: relative;
      }
    }

    &-item {
      height: $height;
      line-height: $height;
      padding: 0 16px;
      min-width: 100px;
      text-align: center;

      &.router-link-active {
        border-bottom: 1px solid #1890ff;
      }
      &:hover {
        cursor: pointer;
        font-weight: 500;
      }
    }
  }

  &__note {
    padding: 0 16px;
  }

  &__user {
    display: flex;
    align-items: center;
    padding-right: 20px;

    span {
      padding: 0 10px;
    }
  }
}
</style>
