<template>
  <div class="app-wrapper">
    <sidebar/>
    <div class="main-container">
      <navbar/>
      <app-main/>
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
  methods: {
  },
};
</script>

<style lang="scss">
.main-container {
  margin-left: 210px;
}
</style>
