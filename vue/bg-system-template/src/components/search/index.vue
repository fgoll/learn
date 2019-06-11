<template>
  <div class="search">
    <div
      v-for="(config, index) in configs"
      :key="config.uniKey"
      class="search-row"
      type="flex"
      align="middle"
    >
      <div class="fixed-column">
        <a-checkbox
          :checked="config.checked"
          @change="(e) => checkOnChange(e, config)"
        />
      </div>

      <div class="fixed-column">
        <a-select
          style="width: 120px"
          placeholder="请选择搜索类型"
          :default-value="config.key"
          @change="(value) => handleSearchType(value, config)"
        >
          <a-select-option
            v-for="(item) in searchTypes"
            :key="item.key"
            :value="item.key"
            :disabled="selectedMap[item.key]"
          >
            {{ item.name }}
          </a-select-option>
        </a-select>
      </div>

      <div class="fixed-column">
        <a-select

          :value="config.op"
          placeholder="请选择搜索条件"
          style="width: 80px"
          @change="(value) => config.op = value"
        >
          <a-select-option
            v-for="(item) in getOps(config.key)"
            :key="item.op"
            :value="item.op"
          >
            {{ item.name }}
          </a-select-option>
        </a-select>
      </div>

      <div class="full-column">
        <a-input
          v-if="getValueType(config.key) === SEARCH_VALUE_TYPE.INPUT"
          v-model="config.values"
          placeholder="请输入要搜索的值"
        />
        <a-select
          v-else-if="getValueType(config.key) === SEARCH_VALUE_TYPE.MULTISELECT"
          ref="selector"
          v-model="config.values"
          v-loadmore="() => loadMore(config)"
          :get-popup-container="triggerNode => triggerNode"
          mode="multiple"
          style="width: 100%"
          placeholder="请选择要搜索的值"
          :loading="config.loading"
          :filter-option="filterOption"
          @dropdownVisibleChange="(open) => handleSelectOpen(open, config)"
        >
          <a-select-option
            v-for="value in config.valuesOp"
            :key="value.id"
            :value="value.id"
          >
            {{ value.name }}
          </a-select-option>
        </a-select>

        <a-range-picker
          v-if="getValueType(config.key) === SEARCH_VALUE_TYPE.RANGEDATE"
          v-model="config.values"
        />
      </div>

      <div class="fixed-column">
        <a-button
          style="width: 100%"
          @click="searchDidClick(config)"
        >
          查询
        </a-button>
      </div>

      <div class="fixed-column">
        <a-button
          :disabled="configs.length === 1"
          @click="removeConfig(index)"
        >
          -
        </a-button>
      </div>

      <div class="fixed-column">
        <a-button
          style="width: 100%"
          :disabled="fulled"
          @click="addConfig"
        >
          +
        </a-button>
      </div>
    </div>

    <a-row
      class="operation-row"
      type="flex"
      align="middle"
    >
      <a-col :span="12">
        <!-- <a-checkbox
          :checked="isAllChecked"
          @change="allCheckOnChange"
        >全选</a-checkbox> -->
        <a-button
          style="margin-right: 10px"
          @click="clearAll"
        >
          清除
        </a-button>
      </a-col>
      <a-col
        :span="12"
        style="text-align: right"
      >
        <a-button @click="searchAllDidClick">
          查询全部
        </a-button>
      </a-col>
    </a-row>
  </div>
</template>

<script>
/* eslint-disable no-param-reassign */
/* eslint-disable no-plusplus */

import { opMap } from './utils';
import {
  SEARCH_VALUE_TYPE, makeAttrsMap, configToParams, configsToParams,
} from '@/components/search/utils';

const defaultConfig = {
  checked: true,
  key: undefined,
  op: undefined,
  values: undefined,
  valuesOp: null,
  loading: false,
  pagination: {
    page: 1,
    size: 20,
  },
};

let uniKey = 1;

export default {
  name: 'Search',

  props: {

    allShow: {
      type: Boolean,
      default: false,
    },

    get: {
      type: String,
      default: 'string',
    },

    options: {
      type: Array,
      required: true,
    },

    adapterId: {
      type: [String, Number],
      default: null,
    },

    typeId: {
      type: [String, Number],
      default: null,
    },
  },

  data() {
    return {
      configs: [

      ],
      SEARCH_VALUE_TYPE,
      selectedMap: {},
      fulled: false,
      isAllChecked: true,
    };
  },

  computed: {
    searchTypes() {
      return this.options.map(option => option.searchType);
    },

  },

  created() {
    const defalutOptions = [];
    // default handle
    this.options.forEach((option) => {
      option.ops = option.ops || ['eq'];
      if (typeof option.values === 'string' || option.default) {
        defalutOptions.push(option);
      }
    });

    this.optionsMap = makeAttrsMap(this.options);

    if (this.allShow) {
      for (let i = 0; i < this.options.length; i += 1) {
        const config = Object.assign({ uniKey: ++uniKey }, defaultConfig);
        this.setDefaultValue(config);

        this.configs.push(config);
      }
    } else if (defalutOptions.length) {
      while (defalutOptions.length > 0) {
        const option = defalutOptions.pop();
        const config = Object.assign({ uniKey: ++uniKey }, defaultConfig);
        this.setDefaultValue(config, option);
        this.configs.push(config);
      }
      this.searchAllDidClick();
    } else {
      this.configs.push(Object.assign({ uniKey: ++uniKey }, defaultConfig));
      this.setDefaultValue(this.configs[0]);
    }

    if (this.adapterId) this.commonParam = `adapter_types_id__in=${this.adapterId}`;
    else if (this.typeId) { this.commonParam = +this.typeId === 1 ? 'adapter_types_id__in=1|3' : 'adapter_types_id__in=2|4'; }
  },

  methods: {

    addConfig() {
      this.configs.push(this.setDefaultValue(Object.assign({ uniKey: ++uniKey }, defaultConfig)));
    },

    removeConfig(index) {
      this.selectedMap[this.configs[index].key] = null;
      this.configs.splice(index, 1);
      this.fulled = false;
    },

    clearAll() {
      this.configs = [];
      this.selectedMap = {};
      this.fulled = false;
      const config = Object.assign({ uniKey: ++uniKey }, { ...defaultConfig, checked: false });

      this.$nextTick(() => {
        this.configs.push(this.setDefaultValue(config));
      });
    },

    checkOnChange(e, config) {
      config.checked = e.target.checked;

      this.isAllChecked = this.configs.filter(c => c.checked).length === this.configs.length;
    },

    allCheckOnChange(e) {
      const { checked } = e.target;
      this.configs.forEach((config) => {
        config.checked = checked;
      });
      this.isAllChecked = checked;
    },

    setDefaultValue(config, option) {
      if (option && option.searchType && option.searchType.key) {
        config.key = option.searchType.key;
        this.selectedMap[option.searchType.key] = true;
      } else {
        this.setUnselectKey(config);
      }
      this.setUnselectOp(config);

      //  merge values to config if values is string
      const params = this.optionsMap[config.key];
      if (typeof params.values === 'string') {
        config.values = params.values;
      } else if (params.default) {
        if (typeof params.values === 'function') {
          this.request(config, option);
        }
        config.values = params.default;
      }
      return config;
    },

    setUnselectKey(config) {
      const searchTypes = this.options.map(option => option.searchType)
        .filter(({ key }) => !this.selectedMap[key]);

      if (searchTypes.length === 1) {
        this.fulled = true;
      }

      for (let i = 0; i < searchTypes.length; i++) {
        const searchType = searchTypes[i];

        config.key = searchType.key;

        this.selectedMap[config.key] = true;
        break;
      }
    },

    setUnselectOp(config) {
      const ops = this.getOps(config.key);
      config.op = ops[0].op || undefined;
    },

    getOps(key) {
      const ops = [];
      if (!key) return [];
      const option = this.optionsMap[key];
      if (option && option.ops) {
        return option.ops.map(op => ({ op, name: opMap[op] }));
      }
      return ops;
    },

    getParams(key) {
      const option = this.optionsMap[key];
      if (option && option.params) return option.params;
      return this.commonParam;
    },

    getValueType(key) {
      const option = this.optionsMap[key];
      if (option && option.type) {
        return option.type;
      }
      return SEARCH_VALUE_TYPE.INPUT;
    },

    handleSearchType(value, config) {
      if (config.key) {
        this.selectedMap[config.key] = null;
      }
      this.selectedMap[value] = true;
      config.key = value;
      config.op = undefined;
      config.values = undefined;

      this.$nextTick(() => {
        this.setUnselectOp(config);
      });
    },
    loadMore() {
      // console.log('more');
      // const option = this.optionsMap[config.key];

      // if (typeof option.values === 'function') {
      //   const request = option.values;
      //   config.loading = true;
      //   const params = this.getParams(config.key);

      //   request(params, {
      //     page: config.pagination.page,
      //     page_size: config.pagination.size,
      //   }).then(({ data }) => {
      //     config.valuesOp = [...config.valuesOp, ...data];
      //     config.pagination.page++;
      //   }).finally(() => {
      //     config.loading = false;
      //   });
      // }
    },

    handleSelectOpen(open, config) {
      if (open) {
        const option = this.optionsMap[config.key];

        if (typeof option.values === 'function') {
          // const request = option.values;
          // config.loading = true;
          // const params = this.getParams(config.key);
          // request(params).then(({ data }) => {
          //   config.valuesOp = data;
          //   config.pagination.page++;
          // }).finally(() => {
          //   config.loading = false;
          // });
          this.request(config, option);
        } else if (Array.isArray(option.values)) {
          config.valuesOp = option.values;
        }
      }
    },

    request(config, option) {
      const request = option.values;
      config.loading = true;
      const params = this.getParams(config.key);
      return new Promise((resolve, reject) => {
        request(params).then(({ data }) => {
          config.valuesOp = data;
          config.pagination.page++;
          resolve();
        }).catch((e) => {
          reject(e);
        }).finally(() => {
          config.loading = false;
        });
      });
    },

    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase()
        .indexOf(input.toLowerCase()) >= 0;
    },

    checkConfig(config) {
      if (!config.key) {
        this.$message.warning('请选择搜索类型');
        return false;
      }
      if (!config.op) {
        this.$message.warning('请选择搜索条件');
        return false;
      }
      if (!config.values) {
        this.$message.warning('请选择或输入搜索的值');
        return false;
      }
      return true;
    },


    searchDidClick(config) {
      if (!this.checkConfig(config)) return;
      let params;
      if (this.get === 'string') {
        params = configToParams(config);
      } else {
        const values = config.op === 'like' ? `%25${config.values}%25` : config.values;
        params = {
          [config.key]: values,
        };
      }
      this.$emit('search', params);
    },

    searchAllDidClick() {
      const configs = this.configs.filter(config => config.checked);

      for (let i = 0; i < configs.length; i++) {
        if (!this.checkConfig(configs[i])) return;
      }
      if (this.get === 'string') {
        const params = configsToParams(configs);
        this.$emit('search', params);
      } else {
        const params = configs
          .reduce((prev, config) => ({ ...prev, [config.key]: config.values }), {});
        this.$emit('search', params);
      }
    },
  },

};
</script>

<style lang="scss">
.search-row {
  padding: 5px 0;
  display: flex;
  align-items: center;

  .fixed-column {
    flex: 0 0 auto;
    padding-right: 10px;

  }
  .full-column {
    flex: 1;
    padding-right: 10px;
    text-align: left;
  }
  > div {
    &:last-child {
      padding-right: 0;
    }
  }

}

.operation-row {
  padding: 5px 0 20px;
}
</style>
