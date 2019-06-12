<template>
  <a-form
    class="form"
    :form="form"
    @submit="handleSubmit"
  >
    <a-form-item
      v-for="(item, index) in rows"
      :key="index"
      :required="item.required"
      :label="item.label"
    >
      <template v-if="item.type === ROW_TYPE.INPUT">
        <a-input
          v-decorator="[
            item.filed,
            {rules: item.rules}
          ]"
          :placeholder="item.props.placeholder"
        />
      </template>
      <template v-else-if="item.type === ROW_TYPE.SELECT">
        <a-select
          v-decorator="[
            item.filed,
            {rules: item.rules}
          ]"
          :placeholder="item.props.placeholder"
          :mode="item.props.mode"
        >
          <a-select-option
            v-for="(option) in item.props.options"
            :key="option.id"
          >
            {{ option.label }}
          </a-select-option>
        </a-select>
      </template>
      <template v-else-if="item.type === ROW_TYPE.RADIO">
        <a-radio-group
          v-decorator="[
            item.filed,
            {rules: item.rules}
          ]"
        >
          <a-radio
            v-for="(option) in item.props.options"
            :key="option.id"
            :value="option.id"
          >
            {{ option.label }}
          </a-radio>
        </a-radio-group>
      </template>
      <template v-else>
        <slot
          :name="item.filed"
          :row="item"
        />
      </template>
    </a-form-item>

    <a-form-item>
      <a-button
        :loading="loading"
        type="primary"
        html-type="submit"
      >
        确定
      </a-button>
    </a-form-item>
  </a-form>
</template>

<script>
const ROW_TYPE = {
  INPUT: 'input',
  SELECT: 'select',
  RADIO: 'radio',
  CUSTOM: 'custom',
};

export default {
  props: {
    rows: {
      type: Array,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      ROW_TYPE,
    };
  },

  created() {
    this.form = this.$form.createForm(this);
  },

  methods: {
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          this.$emit('submit', values);
        }
      });
    },
  },
};
</script>
