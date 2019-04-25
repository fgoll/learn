<template>
  <div v-if="currentApp">
    Branch  --- 来自{{currentApp}}
  </div>
</template>

<script>
import mixin from '@/views/app/mixin/vuex.mixin';

export default {
  mixins: [mixin],
};
</script>
