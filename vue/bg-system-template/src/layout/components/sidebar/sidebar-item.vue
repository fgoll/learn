<template>
  <div v-if="!item.hidden">
    <el-submenu v-if="hasChild(item.children)"
                :index="item.name"
                popper-append-to-body>
      <span slot="title" v-if="item.meta">
        <i class="el-icon-menu"></i>
        <span>{{item.meta.title}}</span>
      </span>
      <sidebar-item
        v-for="child in item.children"
        :key="child.path"
        :item="child"
        class="nest-menu"
      />
    </el-submenu>
    <template v-else>
      <router-link tag="div" :to="{name: item.name}" v-if="item.meta">
        <el-menu-item :index="item.name">
          <i class="el-icon-menu"></i>
          <span>{{item.meta.title}}</span>
        </el-menu-item>
      </router-link>

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
  },
};
</script>
