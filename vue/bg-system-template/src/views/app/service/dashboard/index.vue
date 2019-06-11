<template>
  <div v-if="currentApp">
    Dashboard  --- 来自{{ currentApp }}
  </div>
</template>

<script>
import mixin from '@/views/app/mixin/vuex.mixin';

export default {
  name: 'Dashboard',
  mixins: [mixin],
  data() {
    return {
      app: null,
    };
  },

  mounted() {
    // console.log(this.$route);
    // const { query } = this.$route;
    // this.app = query;
    // message.success(query.key);

  },
};
</script>
