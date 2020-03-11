let { vec3 } = require('./vec3')
let ray = require('./ray')

module.exports = class Camera {
  constructor() {
    this.lower_left_corner = new vec3(-2.0, -1.0, -1.0) 
    this.horizontal = new vec3(4.0, 0.0, 0.0)
    this.vertical = new vec3(0.0, 2.0, 0.0)
    this.origin = new vec3(0.0, 0.0, 0.0)
  }

  get_ray(u, v) {

    let temp_corner = this.lower_left_corner.copy()
    let temp_horizontal = this.horizontal.copy()
    let temp_vertical = this.vertical.copy()
    return new ray(this.origin, temp_corner.add(temp_horizontal.multiply(u).add(temp_vertical.multiply(v))))
  }
}