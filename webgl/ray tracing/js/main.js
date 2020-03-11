let fs = require('fs');

let ray = require('./ray')
let { vec3, dot, unit_vector } = require('./vec3')
let sphere = require('./sphere')
let hitable_list = require('./hitable_list')
let camera = require('./camera')

let CENTER = new vec3(0, 0, -1)

function color(r, world) {
  let rec = {}
  // console.log(rec)
  if (world.hit(r, 0, Number.MAX_VALUE, rec)) {
    return new vec3(rec.normal.x() + 1, rec.normal.y() + 1, rec.normal.z() + 1).multiply(0.5)
  }
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
  let ns = 100

  let output = `P3\n${nx} ${ny}\n255\n`

  let list = [new sphere(new vec3(0, 0, -1), 0.5), new sphere(new vec3(0, -100.5, -1), 100)]

  let world = new hitable_list(list)

  let cam = new camera()

  for (let j = ny - 1; j >= 0; j --) {
    for (let i = 0; i < nx; i ++) {
      let u = i / nx
      let v = j / ny
      
      let col = new vec3(0, 0, 0)
      for (let s = 0; s < ns; s ++) {
        let u = (i + Math.random()) / nx
        let v = (j + Math.random()) / ny
        let r = cam.get_ray(u, v)
         
        col.add(color(r, world))
      }

      col.divide(ns)

      let ir = Math.floor(255.99 * col.get(0))
      let ig = Math.floor(255.99 * col.get(1))
      let ib = Math.floor(255.99 * col.get(2))

      output += `${ir} ${ig} ${ib}\n`
    }
  }

  fs.writeFile('./hello.ppm', output, () => {})
}

main()