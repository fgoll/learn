var fibonacci = function(n) {
  if (typeof n !== 'number') {
    throw new Error('n should be a Number')
  }
  if (n < 0) {
    throw new Error('n should >= 0')
  }
  if (n === 0) return 0
  var res = [1, 1]
  for (let i = 2; i < n; i ++) {
    res[i] = res[i - 1] + res[i - 2]
  }
  return res[n-1]
}

/**
 * When a file is run directly from Node.js, require.main is set to its module. 
 * That means that it is possible to determine whether a file has been run 
 * directly by testing require.main === module.
 */
if (require.main === module) {
  var n = Number(process.argv[2]);
  console.log('fibonacci(' + n + ') is', fibonacci(n));
}

exports.fibonacci = fibonacci;