module.exports = function(obj, keys) {
  obj = obj || {};

  if (typeof keys === 'string') keys = keys.split(/ +/);
  return keys.reduce(function(prev, curr) {
    if (!obj[curr]) return prev
    return { ...prev, [curr]: obj[curr]}
  }, {})
}