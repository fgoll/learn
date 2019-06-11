// eslint-disable-next-line no-underscore-dangle
const _toString = Object.prototype.toString;

export function isObject(obj) {
  return obj !== null && typeof obj === 'object';
}

export function isPlainObject(obj) {
  return _toString.call(obj) === '[object Object]';
}
