let fs = require('fs');

let ray = require('./ray')
let {vec3, unit_vector} = require('./vec3')

function color(r) {
  let unit_direction = unit_vector(r.direction())
  let t = 0.5 * (unit_direction.y() + 1.0)
  let start_value = new vec3(1.0, 1.0, 1.0)
  let end_value = new vec3(0.5, 0.7, 1.0)
  let blended_value = start_value.multiply(1.0 - t).add(end_value.multiply(t))
  return blended_value
}

function main() {
  let nx = 200
  let ny = 100

  let output = `P3\n${nx} ${ny}\n255\n`

  let lower_left_corner = new vec3(-2.0, -1.0, -1.0)
  let horizontal = new vec3(4.0, 0.0, 0.0)
  let vertical = new vec3(0.0, 2.0, 0.0)
  let origin = new vec3(0.0, 0.0, 0.0)

  for (let j = ny - 1; j >= 0; j --) {
    for (let i = 0; i < nx; i ++) {
      let u = i / nx
      let v = j / ny
      let temp_corner = lower_left_corner.copy()
      let temp_horizontal = horizontal.copy()
      let temp_vertical = vertical.copy()
      let r = new ray(origin, temp_corner.add(temp_horizontal.multiply(u).add(temp_vertical.multiply(v))))
      let col = color(r)

      let ir = Math.floor(255.99 * col.get(0))
      let ig = Math.floor(255.99 * col.get(1))
      let ib = Math.floor(255.99 * col.get(2))

      output += `${ir} ${ig} ${ib}\n`
    }
  }

  fs.writeFile('./hello.ppm', output, () => {})
}

main()