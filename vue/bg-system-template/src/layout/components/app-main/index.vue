<template>
  <section class="app-main">
    <transition
      name="fade-transform"
      mode="out-in"
    >
      <router-view :key="key" />
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    key() {
      return this.$route.fullPath;
    },
  },
};
</script>

<style lang='scss' scoped>
@import "~@/styles/variables.scss";

.app-main {
  /*50 = navbar  */
  height: calc(100vh - 90px);
  width: 100%;
  position: relative;
  overflow: hidden;
  padding: 6px;
  background: $bg;
}
.fixed-header+.app-main {
  padding-top: 90px;
}
</style>
