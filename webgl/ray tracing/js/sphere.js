let {  dot } = require('./vec3')
module.exports = class sphere {
  
  constructor(cen, r) {
    this.center = cen
    this.radius = r
  }

  hit(r, t_min, t_max, rec) {
    let oc = r.origin().copy().minus(this.center)

    let a = dot(r.direction(), r.direction())
    let b = dot(oc, r.direction())
    let c = dot(oc, oc) - this.radius * this.radius
    let discriminant = b * b - a * c
    // console.log(discriminant)
    if (discriminant > 0) {
      let temp = (-b - Math.sqrt(discriminant)) / a
      if (temp < t_max && temp > t_min) {
        rec.t = temp
        rec.p = r.point_at_parameter(temp)
        rec.normal = rec.p.copy().minus(this.center).divide(this.radius)
        return true
      }
      temp = (-b + Math.sqrt(discriminant)) / a
      if (temp < t_max && temp > t_min) {
        rec.t = temp
        rec.p = r.point_at_parameter(temp)
        rec.normal = rec.p.copy().minus(this.center).divide(this.radius)
        return true
      }
    }
    return false
    
  }  
}