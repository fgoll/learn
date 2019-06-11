export const opMap = {
  eq: '等于',
  ne: '不等于',
  gt: '大于',
  ge: '大于等于',
  lt: '小于',
  le: '小于等于',
  like: '包含',
  in: 'IN',
  not_in: 'NOT IN',
};

export const SEARCH_VALUE_TYPE = {
  INPUT: 'INPUT',
  SELECT: 'SELECT',
  MULTISELECT: 'MULTISELECT', // 多选
  RANGEDATE: 'RANGEDATE', // 日期范围
};

export function makeAttrsMap(attrs) {
  const map = {};
  for (let i = 0; i < attrs.length; i += 1) {
    map[attrs[i].searchType.key] = { ...attrs[i] };
  }
  return map;
}

export function configToParams(config) {
  let { values } = config;

  if (Array.isArray(values)) {
    values = values.join('|');
  }
  values = config.op === 'like' ? `%25${values}%25` : values;

  return `${config.key}__${config.op}=${values}`;
}

export function configsToParams(configs) {
  const res = [];
  for (let i = 0; i < configs.length; i += 1) {
    const config = configs[i];
    res.push(configToParams(config));
  }
  return res.join(',');
}
