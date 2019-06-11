import Search from '@/components/search';
import { isPlainObject } from '@/utils/utils';

export default {
  components: { Search },
  data() {
    return {
      list: null,
      loading: false,
      pagination: {
        total: 0,
        pageSize: 10,
        current: 1,
        showQuickJumper: true,
        // hideOnSinglePage: true,
        showSizeChanger: true,
        showTotal(total) {
          return `总计${total}条`;
        },
      },
      curStatus: null,
      openSearch: false,
      searchOptions: null,
    };
  },
  created() {
    if (!this.handleParams()) {
      this.getList();
    }
  },
  methods: {
    // 参数处理
    handleParams(handler) {
      const { query } = this.$route;
      let { params } = this.$route;

      if (Object.keys(params).length === 0) { params = query; }

      let showSearch = false;

      const searchMap = (this.searchOptions || []).reduce((prev, curr) => ({
        ...prev,
        [curr.searchType.key]: curr,
      }), {});

      if (handler && typeof handler === 'function') {
        handler(params);
      }

      Object.keys(params).forEach((key) => {
        const option = searchMap[key];
        if (option) {
          if (typeof option.values === 'function') {
            option.default = params[key];
          } else {
            option.values = params[key];
          }
          showSearch = true;
        }
      });

      this.openSearch = showSearch;
      return showSearch;
    },

    mergeQString(searchQ, customQ) {
      let customQS = '';
      if (isPlainObject(customQ)) {
        Object.keys(customQ).forEach((key) => {
          customQS += `${key}=${customQ[key]}`;
        });
      } else if (typeof customQ === 'string') {
        customQS = customQ;
      }
      if (searchQ) {
        return `${searchQ},${customQS}`;
      }
      return customQS;
    },

    // 需要实现的方法
    loadData() {
      return {
        data: [],
        total: 0,
      };
    },

    async getList() {
      this.loading = true;

      try {
        const res = await this.loadData();
        console.log(res);
        this.pagination.total = res.total || 0;

        this.list = res.data;
      } catch (e) {
        console.log(e);
        this.$message.error('加载出错');
      } finally {
        this.loading = false;
      }
    },

    handlePageChange(pagination) {
      this.pagination = pagination;
      this.getList();
    },

    handleSearch(qstring) {
      this.qstring = qstring;
      this.getList();
    },
  },
};
