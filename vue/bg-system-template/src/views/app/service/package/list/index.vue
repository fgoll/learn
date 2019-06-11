<template>
  <div class="app-container">
    <div class="app-header">
      <a-row>
        <a-col
          class="app-header-item"
          :span="4"
        >
          <a-button
            v-if="searchOptions"
            type="primary"
            :class="{'ant-btn-deep': openSearch}"
            @click="openSearch = !openSearch"
          >
            搜索
          </a-button>
        </a-col>

        <a-col
          class="app-header-item app-header-item__center"
          :span="16"
        >
          <template v-if="curStatus">
            <a-radio-group
              v-model="curStatus"
              button-style="solid"
              @change="statusDidChange"
            >
              <a-radio-button value="ALL">
                全部
              </a-radio-button>
              <a-radio-button
                v-for="(item, index) in statusArr"
                :key="index"
                :value="item.value"
              >
                {{ item.label }}
              </a-radio-button>
            </a-radio-group>
          </template>
        </a-col>

        <a-col
          class="app-header-item"
          :span="4"
        >
          <a-button
            type="primary"
            @click="$router.push({name: 'package/sponsor'})"
          >
            新建
          </a-button>
        </a-col>
      </a-row>
      <search
        v-if="searchOptions"
        v-show="openSearch"
        :options="searchOptions"
        @search="handleSearch"
      />
    </div>

    <a-table
      row-key="id"
      :columns="columns"
      :pagination="pagination"
      :data-source="list"
      :loading="loading"
      @change="handlePageChange"
      @showSizeChange="handlePageChange"
    />
  </div>
</template>

<script>
// import { SEARCH_VALUE_TYPE } from '@/components/search/utils';
import mixin from '@/views/app/mixin/vuex.mixin';
import listMixin from '@/mixins/list.mixins';
import { posts } from '@/api/post';

const columns = [
  {
    title: 'id', dataIndex: 'id',
  },
  {
    title: '内容', dataIndex: 'content', scopedSlots: { customRender: 'channels' },
  },
  {
    title: '作者', dataIndex: 'author', scopedSlots: { customRender: 'status' },
  }];

export default {
  mixins: [mixin, listMixin],

  data() {
    return {
      columns,
    };
  },

  methods: {
    loadData() {
      return posts();
    },
  },
};
</script>
