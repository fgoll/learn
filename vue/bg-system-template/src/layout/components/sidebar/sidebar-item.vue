<template>
  <div v-if="!item.hidden">
    <el-submenu
      v-if="hasChild(item.children)"
      :index="item.name"
      popper-append-to-body
    >
      <template
        v-if="item.meta"
        slot="title"
      >
        <svg-icon :icon-class="item.meta.icon" />
        <span slot="title">{{ item.meta.title }}</span>
      </template>

      <sidebar-item
        v-for="child in item.children"
        :key="child.path"
        :item="child"
        class="nest-menu"
      />
    </el-submenu>
    <template v-else>
      <!-- <router-link v-if="item.meta" tag="div" :to="{name: item.name}">
        <el-menu-item :index="item.name">
          <svg-icon :icon-class="item.meta.icon" />
          <span slot="title">{{ item.meta.title }}</span>
        </el-menu-item>
      </router-link> -->
      <!-- <router-link  tag="div" :to="{name: item.name}"> -->
      <el-menu-item
        v-if="item.meta"
        :index="item.name"
        @click="linkTo(item.name)"
        @dblclick.native="dblinkTo(item.name)"
      >
        <svg-icon :icon-class="item.meta.icon" />
        <span slot="title">{{ item.meta.title }}</span>
      </el-menu-item>
      <!-- </router-link> -->
    </template>
    <!-- <router-link :to="item.path">{{item.meta.title}}</router-link> -->
  </div>
</template>

<script>

export default {

  name: 'SidebarItem',
  props: {
    item: {
      type: Object,
      required: true,
    },
    basePath: {
      type: String,
      default: '',
    },
  },
  methods: {
    hasChild(children = []) {
      const showingChildren = children.filter(item => !item.hidden);
      return showingChildren.length !== 0;
    },

    linkTo(name) {
      this.$router.push({
        name,
      });
    },

    dblinkTo(name) {
      this.$router.push({
        name,
        query: {
          t: +new Date(), // 保证每次点击路由的query项都是不一样的，确保会重新刷新view
        },
      });
    },
  },
};
</script>
