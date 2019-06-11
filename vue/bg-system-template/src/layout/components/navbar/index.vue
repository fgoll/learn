<template>
  <div class="navbar-wrap">
    <div class="navbar">
      <hamburger
        :is-active="sidebar.opened"
        class="navbar__hamburger"
        @toggleClick="toggleSideBar"
      />
      <a-select
        show-search
        placeholder="选择应用"
        option-filter-prop="children"
        style="width: 150px;"
      >
        <a-select-option value="all">
          全部应用
        </a-select-option>
        <a-select-option value="a">
          宝宝巴士App-B
        </a-select-option>
        <a-select-option value="b">
          宝宝巴士App-C
        </a-select-option>
      </a-select>

      <div class="navbar__tabs">
        <div class="navbar__tabs-wrap">
          <div>
            <router-link
              v-for="route in routes"
              :key="route.path"
              :to="route.path"
              class="navbar__tabs-item"
            >
              {{ route.meta.title }}
            </router-link>
          </div>
        <!-- <div class="ant-tabs-ink-bar ant-tabs-ink-bar-animated"></div> -->
        </div>
      </div>

      <!-- <a-badge class="navbar__note">
        <a-icon type="bell" />
      </a-badge> -->

      <a-popover placement="bottom">
        <template slot="content">
          <!-- <a-tag color="#f50">退出登录</a-tag> -->
          <div style="text-align: center; padding-bottom: 10px;">
            <router-link :to="{name: 'basic'}">
              个人中心
            </router-link>
          </div>

          <a-button
            type="dashed"
            @click="logout"
          >
            退出登录
          </a-button>
        </template>
        <div
          class="navbar__user"
        >
          <a-avatar>
            username
          </a-avatar>
          <span class="name">username</span>
        </div>
        <!-- <div>测试</div> -->
      </a-popover>
    </div>
    <div class="breadcrumb-wrap">
      <breadcrumb />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Hamburger from '@/components/hamburger';
import Breadcrumb from '@/components/breadcrumb';

export default {
  components: {
    Hamburger,
    Breadcrumb,
  },
  computed: {
    ...mapGetters([
      'sidebar',
    ]),
    routes() {
      const { matched } = this.$route.matched[0].meta;

      const routes = this.$router.options.routes.filter(item => !item.hidden
            && new RegExp(matched).test(item.path));

      return routes;
    },
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('settings/toggleSideBar');
    },
    logout() {
      this.$store.dispatch('user/logout').then(() => {
        this.$message.success('退出成功');
        this.$router.push('/login');
      }).catch((error) => {
        this.$message.error(error.message);
      });
    },

  },
};
</script>

<style lang="scss" scoped>
$height: 50px;
.navbar-wrap {

    z-index: 999;
    position: relative;
}
.navbar {
  height: $height;
  // overflow: hidden;
  position: relative;
  background: #fff;
  display: flex;
  align-items: center;
    box-shadow: 0 1px 5px #d3d3d3;

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
        border-bottom: 2px solid #1890ff;
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
    flex: 0 0 auto;

    &:hover {
      cursor: pointer;
    }

    > .name {
      padding: 0 10px;
    }
  }
}
.breadcrumb-wrap {
  height: 40px;
  padding-left: 16px;
  display: flex;
  align-items: center;
  margin-top: 1px;
}
</style>
