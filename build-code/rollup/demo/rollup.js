const rollup = require('../dist/rollup')

try {

  rollup(__dirname + '/main.js')
} catch(e) {
  console.log(e)
}