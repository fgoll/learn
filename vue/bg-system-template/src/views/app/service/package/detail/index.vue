<template>
  <div class="app-container app-detail-page">
    <detail
      :rows="rows"
      :loading="loading"
      @submit="handleSubmit"
    >
      <template
        v-slot:custom="props"
      >
        <div
          class="section"
        >
          <div
            class="platform-item"
          >
            <a-icon
              type="android"
              style="font-size: 40px;"
            />
            <div>安卓</div>
          </div>
          <div
            class="platform-item"
          >
            <a-icon
              type="apple"
              style="font-size: 40px;"
            />
            <div>苹果</div>
          </div>
        </div>
      </template>
    </detail>
  </div>
</template>

<script>
import mixin from '@/views/app/mixin/vuex.mixin';
import Detail from '@/components/detail';


const rows = [
  {
    label: '平台',
    filed: 'platform',
    rules: [{ required: true, message: '请输入平台' }],
    type: 'input',
    props: {
      value: '',
      placeholder: '请输入平台',
    },
  },
  {
    label: '渠道',
    filed: 'channel',
    rules: [{ required: true, message: '请输入平台' }],
    type: 'select',
    props: {
      placeholder: '请输入渠道',
      mode: 'multiple', // 'default' | 'multiple' | 'tags' | 'combobox'
      options: [{ id: 1, label: '陈赤赤' }, { id: 2, label: '11' }],
    },
  },
  {
    label: '类型',
    filed: 'type',
    rules: [{ required: true, message: '请输入平台' }],
    type: 'radio',
    props: {
      options: [{ id: 1, label: '陈赤赤' }, { id: 2, label: '11' }],
      defaultValue: 1,
    },
  },
  {
    label: 'Custom',
    required: true,
    filed: 'custom',
    rules: [{ required: true, message: '请输入平台' }],
    type: 'custom',
  },
];
export default {

  components: {
    Detail,
  },
  mixins: [mixin],
  data() {
    return {
      loading: false,
      rows,
    };
  },

  created() {
  },

  methods: {
    handleSubmit(values) {
      // eslint-disable-next-line no-console
      console.log(values);
    },
  },
};
</script>
