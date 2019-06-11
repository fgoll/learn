<template>
  <div class="application-list">
    <a-table
      :columns="columns"
      :data-source="data"
    >
      <a
        slot="name"
        slot-scope="name, item"
        href="javascript:;"
        style="color: #409EFF"
        @click="go2Detail({name: 'dashboard', key: item.key})"
      >{{ name }}</a>
      <div
        slot="participant"
        slot-scope="participant"
      >
        <a-avatar
          v-for="item in participant"
          :key="item.key"
          style="margin-right: -10px"
          size="small"
          icon="user"
        />
      </div>
      <a
        slot="action"
        href="javascript:;"
      >邀请人员</a>
    </a-table>
  </div>
</template>

<script>
const columns = [
  {
    title: '应用列表', dataIndex: 'name', key: 'name', scopedSlots: { customRender: 'name' },
  },
  { title: '创建人', dataIndex: 'creator', key: 'creator' },
  {
    title: '参与人员', dataIndex: 'participant', key: 'participant', scopedSlots: { customRender: 'participant' },
  },
  {
    title: '操作',
    dataIndex: '',
    key: 'x',
    scopedSlots: { customRender: 'action' },
  },
];

const data = [
  {
    key: 1,
    name: '应用1',
    creator: '李',
    participant: [{ key: 1 }],
  },
  {
    key: 2,
    name: '应用2',
    creator: '李',
    participant: [{ key: 1 }, { key: 2 }],
  },
  {
    key: 3,
    name: '应用3',
    creator: '李',
    participant: [{ key: 3 }],
  },
];

export default {
  data() {
    return {
      data,
      columns,
    };
  },

  methods: {
    go2Detail(p) {
      this.$store.commit('app/SET_CURRENT', p.key);
      this.$router.push(p);
    },
  },
};
</script>


<style lang="scss" scoped>
.application-list {
  background: #fff;
  padding: 16px;
  height: 100%;
}
</style>
