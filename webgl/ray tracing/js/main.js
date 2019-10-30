let vec3 = require('./vec3')
let fs = require('fs');

function main() {
  let nx = 200
  let ny = 100

  let output = `P3\n${nx} ${ny}\n255\n`

  for (let j = ny - 1; j >= 0; j --) {
    for (let i = 0; i < nx; i ++) {
      let col = new vec3(i / nx, j / ny, 0.2)

      let ir = Math.floor(255.99 * col.get(0))
      let ig = Math.floor(255.99 * col.get(1))
      let ib = Math.floor(255.99 * col.get(2))

      output += `${ir} ${ig} ${ib}\n`
    }
  }

  fs.writeFile('./hello.ppm', output, () => {})
}

main()